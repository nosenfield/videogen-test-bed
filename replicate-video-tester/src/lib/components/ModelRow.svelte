<script lang="ts">
	/**
	 * ModelRow Component
	 * 
	 * Main orchestrator component for a single model test instance.
	 * Integrates all feature components and manages the complete generation workflow.
	 * 
	 * @component
	 * @example
	 * <ModelRow
	 *   id="row-1"
	 *   onRemove={(id) => console.log('Remove row', id)}
	 * />
	 */
	import { generationsStore, addGeneration, updateGeneration } from "$lib/stores/generations";
	import { modelsStore } from "$lib/stores/models";
	import { setError, clearError, updateSessionCost } from "$lib/stores/ui";
	import { initializeReplicate, generateVideo, pollGenerationStatus, cancelGeneration } from "$lib/services/replicate";
	import { DEFAULT_VIDEO_DURATION } from "$lib/utils/constants";
	import { formatErrorMessage } from "$lib/utils/formatting";
	import { onDestroy } from "svelte";
	import ModelSelector from "./ModelSelector.svelte";
	import ParameterForm from "./ParameterForm.svelte";
	import GenerationStatus from "./GenerationStatus.svelte";
	import CostEstimator from "./CostEstimator.svelte";
	import ErrorDisplay from "./ErrorDisplay.svelte";
	import VideoPlayer from "./ui/VideoPlayer.svelte";
	import Button from "./ui/Button.svelte";
	import type { GenerationStatus as GenStatus } from "$lib/types/generation";
	import type { PredictionStatus } from "$lib/types/replicate";

	interface Props {
		id: string;
		onRemove: (id: string) => void;
	}

	let { id, onRemove }: Props = $props();

	// Local state for UI interactions
	let selectedModelId = $state<string>("");
	let parameters = $state<Record<string, string | number | boolean>>({});
	let isGenerating = $state(false);
	let currentPredictionId = $state<string | null>(null);
	let isCancelled = $state(false);

	/**
	 * Map Replicate PredictionStatus to our GenerationStatus type.
	 * 
	 * @param status - Replicate API prediction status
	 * @returns Mapped generation status for internal use
	 */
	function mapPredictionStatus(status: PredictionStatus): GenStatus {
		switch (status) {
			case "starting":
				return "queued";
			case "processing":
				return "processing";
			case "succeeded":
				return "completed";
			case "failed":
				return "error";
			case "canceled":
				return "canceled";
			default:
				return "idle";
		}
	}

	/**
	 * Type guard to check if value is a record with a string field
	 */
	function isRecordWithStringField<K extends string>(
		obj: unknown,
		field: K
	): obj is Record<string, unknown> & Record<K, string> {
		return (
			typeof obj === "object" &&
			obj !== null &&
			field in obj &&
			typeof (obj as Record<string, unknown>)[field] === "string"
		);
	}

	/**
	 * Extract video URL from prediction output.
	 * Tries multiple common field names and formats used by different Replicate models.
	 * 
	 * @param output - Prediction output object (unknown type from API)
	 * @returns Video URL string or null if not found
	 */
	function extractVideoUrl(output: unknown): string | null {
		if (!output) {
			return null;
		}

		// Handle direct string output (some models return URL directly)
		// Security: Only accept HTTPS URLs per security best practices
		if (typeof output === "string") {
			return output.startsWith("https://") ? output : null;
		}

		// Handle array output (some models return array of URLs)
		// Security: Only accept HTTPS URLs per security best practices
		if (Array.isArray(output)) {
			const firstUrl = output.find((item) => 
				typeof item === "string" && item.startsWith("https://")
			);
			if (firstUrl) {
				return firstUrl;
			}
		}

		if (typeof output !== "object" || output === null) {
			return null;
		}

		const obj = output as Record<string, unknown>;
		
		// Try common video URL fields
		if (isRecordWithStringField(obj, "video")) {
			return obj.video;
		}
		if (isRecordWithStringField(obj, "url")) {
			return obj.url;
		}
		// Try nested output array
		if (Array.isArray(obj.output) && obj.output.length > 0) {
			const first = obj.output[0];
			if (typeof first === "string") {
				return first;
			}
		}
		
		// Try to find any string value that looks like a URL (recursively)
		// Security: Only accept HTTPS URLs per security best practices
		function findUrl(value: unknown): string | null {
			if (typeof value === "string" && value.startsWith("https://")) {
				return value;
			}
			if (Array.isArray(value)) {
				for (const item of value) {
					const url = findUrl(item);
					if (url) return url;
				}
			}
			if (typeof value === "object" && value !== null) {
				for (const nestedValue of Object.values(value)) {
					const url = findUrl(nestedValue);
					if (url) return url;
				}
			}
			return null;
		}

		return findUrl(obj);
	}

	/**
	 * Calculate cost estimate for video generation based on model pricing and parameters.
	 * 
	 * @param modelId - ID of the selected model
	 * @param params - Generation parameters (uses duration if pricing is per-second)
	 * @returns Estimated cost in USD, or null if pricing unavailable
	 */
	function calculateCost(modelId: string, params: Record<string, string | number | boolean>): number | null {
		const model = $modelsStore.find((m) => m.id === modelId);
		if (!model || !model.pricing) {
			return null;
		}

		const baseCost = model.pricing.estimatedCost;
		const unit = model.pricing.unit;

		// If pricing is per second, multiply by duration
		if (unit === "per second") {
			const duration = typeof params.duration === "number" ? params.duration : DEFAULT_VIDEO_DURATION;
			return baseCost * duration;
		}

		// Otherwise, use base cost
		return baseCost;
	}

	// Handle model selection change
	function handleModelChange(modelId: string) {
		selectedModelId = modelId;
		// Reset parameters when model changes
		parameters = {};
	}

	// Handle parameter changes from ParameterForm
	function handleParametersChange(newParams: Record<string, string | number | boolean>) {
		parameters = newParams;
	}

	// Handle generate button click
	async function handleGenerate() {
		if (!selectedModelId) {
			setError("Please select a model");
			return;
		}

		// Validate required parameters
		const model = $modelsStore.find((m) => m.id === selectedModelId);
		if (!model) {
			setError("Selected model not found");
			return;
		}

		// LIMITATION: DOM manipulation fallback for debounced parameters
		// This is a workaround for ParameterForm's debounced onChange callback.
		// When users click Generate quickly after changing form values, the debounced
		// callback may not have fired yet, leaving the parameters object empty.
		//
		// TODO: Refactor to remove this anti-pattern. Options:
		// 1. Remove debouncing from ParameterForm's onChange (make it immediate)
		// 2. Add a form submit handler that captures current form state synchronously
		// 3. Use a ref/binding pattern to access ParameterForm's internal state
		// 4. Expose a getCurrentValues() method from ParameterForm
		//
		// This violates Svelte's reactive architecture but is necessary until
		// ParameterForm is refactored to support synchronous value access.
		//
		// Wait a bit for any pending debounced parameter updates from ParameterForm
		// This ensures we capture the latest form values before generating
		await new Promise((resolve) => setTimeout(resolve, 350));

		// If parameters are still empty, read directly from form inputs as fallback
		// This handles the case where debounced onChange hasn't fired yet
		let finalParameters = { ...parameters };
		if (Object.keys(finalParameters).length === 0) {
			// Find the form inputs within this row and read their values
			const rowElement = document.querySelector(`[data-row-id="${id}"]`);
			if (rowElement) {
				// For each model parameter, find its corresponding input by label text
				for (const param of model.parameters) {
					// Find label containing the parameter name (may include * for required fields)
					const labels = Array.from(rowElement.querySelectorAll('label'));
					const paramLabel = labels.find((label) => {
						const labelText = label.textContent || '';
						// Match if label contains parameter name (with or without *)
						return labelText.includes(param.name);
					});
					
					if (paramLabel) {
						// Get the associated input/select using the 'for' attribute
						const labelFor = paramLabel.getAttribute('for');
						if (labelFor) {
							const input = rowElement.querySelector(`#${labelFor}`) as HTMLInputElement | HTMLSelectElement | null;
							if (input) {
								if (input instanceof HTMLInputElement) {
									if (input.type === 'checkbox') {
										finalParameters[param.name] = input.checked;
									} else if (input.type === 'number') {
										const num = parseFloat(input.value);
										if (!isNaN(num)) finalParameters[param.name] = num;
									} else {
										if (input.value) finalParameters[param.name] = input.value;
									}
								} else if (input instanceof HTMLSelectElement) {
									if (input.value) finalParameters[param.name] = input.value;
								}
							}
						}
					}
					
					// Also check for checkboxes (they might not have labels with 'for' attribute)
					if (param.type === 'boolean') {
						const checkbox = rowElement.querySelector(`input[type="checkbox"]`) as HTMLInputElement | null;
						if (checkbox && checkbox.checked !== undefined) {
							// Try to match by nearby label text
							const checkboxLabel = checkbox.closest('label');
							if (checkboxLabel?.textContent?.includes(param.name)) {
								finalParameters[param.name] = checkbox.checked;
							}
						}
					}
				}
			}
		}

		// Check for required parameters without defaults
		const missingRequired = model.parameters
			.filter((p) => p.required && p.default === null)
			.filter((p) => !(p.name in finalParameters) || finalParameters[p.name] === "" || finalParameters[p.name] === null);

		if (missingRequired.length > 0) {
			setError(`Missing required parameters: ${missingRequired.map((p) => p.name).join(", ")}`);
			return;
		}

		try {
			// Initialize Replicate client
			try {
				initializeReplicate();
			} catch (err) {
				// If initialization fails, provide clear error message
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to initialize Replicate client. Please check your API key configuration.";
				setError(errorMessage);
				return;
			}

			clearError();
			isGenerating = true;

			// Create initial generation entry
			const generationId = id;
			const startTime = Date.now();
			
			addGeneration({
				id: generationId,
				modelId: selectedModelId,
				parameters: { ...finalParameters },
				status: "queued",
				videoUrl: null,
				error: null,
				startTime,
				endTime: null,
				cost: null,
				predictionId: null,
			});

			// Clean parameters: remove null/undefined/empty string values and ensure correct types
			const cleanedParameters: Record<string, string | number | boolean> = {};
			for (const [key, value] of Object.entries(finalParameters)) {
				// Get parameter definition once
				const paramDef = model.parameters.find((p) => p.name === key);
				
				// Skip null, undefined, or empty string values (except for required parameters)
				if (value === null || value === undefined || value === "") {
					// Keep required parameters even if empty (validation will catch it upstream)
					if (paramDef?.required) {
						cleanedParameters[key] = value as string;
					}
					continue;
				}
				
				// For select parameters with numeric values, ensure they're numbers
				if (paramDef?.type === "select" && typeof value === "string") {
					// Check if the option value is numeric
					const option = paramDef.options?.find((opt) => String(opt.value) === value);
					if (option && typeof option.value === "number") {
						cleanedParameters[key] = option.value;
					} else {
						cleanedParameters[key] = value;
					}
				} else {
					cleanedParameters[key] = value;
				}
			}

			// Start video generation
			const prediction = await generateVideo(selectedModelId, cleanedParameters);
			currentPredictionId = prediction.id;

			// Check if cancelled before continuing
			if (isCancelled) {
				await cancelGeneration(prediction.id);
				updateGeneration(generationId, {
					status: "canceled",
					endTime: Date.now(),
				});
				return;
			}

			// Update with prediction ID
			updateGeneration(generationId, {
				predictionId: prediction.id,
				status: mapPredictionStatus(prediction.status),
			});

			// Poll for completion
			const finalPrediction = await pollGenerationStatus(prediction.id, (updatedPrediction) => {
				// Check if cancelled during polling
				if (isCancelled) {
					return;
				}

				// Update generation on each poll
				const videoUrl = updatedPrediction.output
					? extractVideoUrl(updatedPrediction.output)
					: null;

				updateGeneration(generationId, {
					status: mapPredictionStatus(updatedPrediction.status),
					videoUrl,
					error: updatedPrediction.error || null,
					startTime: updatedPrediction.started_at
						? new Date(updatedPrediction.started_at).getTime()
						: startTime,
				});
			});

			// Check if cancelled after polling completes
			if (isCancelled) {
				if (finalPrediction.status !== "succeeded" && finalPrediction.status !== "failed") {
					await cancelGeneration(prediction.id);
				}
				updateGeneration(generationId, {
					status: "canceled",
					endTime: Date.now(),
				});
				return;
			}

			// Final update on completion
			const finalVideoUrl = finalPrediction.output
				? extractVideoUrl(finalPrediction.output)
				: null;

			// Debug: Log output structure if video URL not found (dev only)
			if (import.meta.env.DEV && finalPrediction.status === "succeeded" && !finalVideoUrl) {
				console.warn("Video URL extraction failed. Output structure:", JSON.stringify(finalPrediction.output, null, 2));
			}

			const endTime = finalPrediction.completed_at
				? new Date(finalPrediction.completed_at).getTime()
				: Date.now();

			// Calculate cost from model pricing
			const calculatedCost = calculateCost(selectedModelId, parameters);

			updateGeneration(generationId, {
				status: mapPredictionStatus(finalPrediction.status),
				videoUrl: finalVideoUrl,
				error: finalPrediction.error || null,
				endTime,
				cost: calculatedCost,
			});

			// Update session cost if generation succeeded
			if (finalPrediction.status === "succeeded" && calculatedCost !== null) {
				updateSessionCost(calculatedCost);
			}
		} catch (error) {
			const errorMessage = formatErrorMessage(error);
			
			// Update or create generation with error
			const currentGen = $generationsStore.items.find((g) => g.id === id);
			if (currentGen) {
				updateGeneration(id, {
					status: "error",
					error: errorMessage,
					endTime: Date.now(),
				});
			} else {
				// If generation wasn't created, add it with error
				addGeneration({
					id,
					modelId: selectedModelId,
					parameters: { ...parameters },
					status: "error",
					videoUrl: null,
					error: errorMessage,
					startTime: Date.now(),
					endTime: Date.now(),
					cost: null,
					predictionId: null,
				});
			}

			setError(errorMessage);
		} finally {
			isGenerating = false;
			currentPredictionId = null;
		}
	}

	// Consolidated generation state (avoids unnecessary derivation chains)
	let generationState = $derived.by(() => {
		const gen = $generationsStore.items.find((g) => g.id === id);
		const status = gen?.status || ("idle" as GenStatus);
		return {
			generation: gen || null,
			status,
			isActive: status === "queued" || status === "processing",
			isComplete: status === "completed",
			hasError: status === "error",
		};
	});

	// Handle remove button click
	async function handleRemove() {
		// Cancel ongoing generation if active
		if (currentPredictionId && (isGenerating || generationState.isActive)) {
			try {
				isCancelled = true;
				await cancelGeneration(currentPredictionId);
				updateGeneration(id, {
					status: "canceled",
					endTime: Date.now(),
				});
			} catch (error) {
				// Log error but continue with removal
				console.error("Failed to cancel generation:", error);
			}
		}
		onRemove(id);
	}

	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		// Enter key to generate (when form input/select is focused and button is enabled)
		if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
			const target = event.target as HTMLElement;
			// Only trigger if focus is within this row's form elements (input, select)
			if (
				(target.tagName === "INPUT" || target.tagName === "SELECT") &&
				target.closest(`[data-row-id="${id}"]`) &&
				!isGenerating &&
				!generationState.isActive &&
				selectedModelId
			) {
				event.preventDefault();
				handleGenerate();
			}
		}
	}

	// Cleanup on component destroy
	onDestroy(() => {
		// Cancel ongoing generation if component is destroyed while generating
		if (currentPredictionId && (isGenerating || generationState.isActive)) {
			cancelGeneration(currentPredictionId)
				.then(() => {
					updateGeneration(id, {
						status: "canceled",
						endTime: Date.now(),
					});
				})
				.catch((error) => {
					// Log error but continue with cleanup
					console.error("Failed to cancel generation on destroy:", error);
				});
		}
	});
</script>

<div class="model-row" data-row-id={id} onkeydown={handleKeydown}>
	<div class="row-header">
		<h3 class="row-title">Model Test #{id}</h3>
		<Button label="Remove" onClick={handleRemove} variant="danger" size="sm" />
	</div>

	<div class="row-content">
		<!-- Model Selection -->
		<div class="section">
			<ModelSelector value={selectedModelId} onChange={handleModelChange} />
		</div>

		<!-- Parameter Form -->
		{#if selectedModelId}
			<div class="section">
				<ParameterForm
					modelId={selectedModelId}
					parameters={parameters}
					onChange={handleParametersChange}
				/>
			</div>
		{/if}

		<!-- Generate Button with Cost Estimator -->
		{#if selectedModelId}
			<div class="section generate-section">
				<div class="cost-estimator-wrapper">
					<CostEstimator modelId={selectedModelId} parameters={parameters} />
				</div>
				<Button
					label={isGenerating ? "Generating..." : "Generate"}
					onClick={handleGenerate}
					disabled={isGenerating || generationState.isActive || !selectedModelId}
					variant="primary"
				/>
			</div>
		{/if}

		<!-- Generation Status -->
		{#if generationState.generation && (generationState.isActive || generationState.isComplete || generationState.hasError)}
			<div class="section">
				<GenerationStatus
					status={generationState.status}
					startTime={generationState.generation.startTime}
					estimatedTime={null}
				/>
			</div>
		{/if}

		<!-- Error Display with Retry -->
		{#if generationState.generation && generationState.hasError && generationState.generation.error}
			<div class="section">
				<ErrorDisplay
					error={generationState.generation.error}
					onDismiss={() => updateGeneration(id, { error: null })}
				/>
				<div class="retry-section">
					<Button
						label="Retry"
						onClick={handleGenerate}
						disabled={isGenerating || generationState.isActive || !selectedModelId}
						variant="primary"
						size="sm"
					/>
				</div>
			</div>
		{/if}

		<!-- Video Player -->
		{#if generationState.generation && generationState.isComplete && generationState.generation.videoUrl}
			<div class="section video-section">
				<VideoPlayer videoUrl={generationState.generation.videoUrl} metadata={null} />
			</div>
		{/if}
	</div>
</div>

<style>
	.model-row {
		border: 1px solid var(--border, #e5e7eb);
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		background: var(--bg-secondary, #ffffff);
	}

	.row-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border, #e5e7eb);
	}

	.row-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text, #111827);
	}

	.row-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.generate-section {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		gap: 1rem;
	}

	.cost-estimator-wrapper {
		flex: 1;
	}

	.video-section {
		margin-top: 1rem;
	}

	.retry-section {
		margin-top: 0.75rem;
		display: flex;
		justify-content: flex-end;
	}

	@media (max-width: 768px) {
		.model-row {
			padding: 1rem;
		}

		.row-header {
			margin-bottom: 1rem;
			padding-bottom: 0.75rem;
		}

		.row-title {
			font-size: 1rem;
		}

		.generate-section {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}

		.cost-estimator-wrapper {
			flex: none;
		}
	}

	@media (max-width: 375px) {
		.model-row {
			padding: 0.75rem;
		}

		.row-title {
			font-size: 0.9375rem;
		}
	}
</style>

