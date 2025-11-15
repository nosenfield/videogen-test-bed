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
	function isRecordWithStringField(
		obj: unknown,
		field: string
	): obj is Record<string, unknown> & { [key: string]: string } {
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
		if (!output || typeof output !== "object" || output === null) {
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
		if (Array.isArray(obj.output) && obj.output.length > 0) {
			const first = obj.output[0];
			if (typeof first === "string") {
				return first;
			}
		}
		
		// Try to find any string value that looks like a URL
		for (const value of Object.values(obj)) {
			if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))) {
				return value;
			}
		}

		return null;
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

		// Check for required parameters without defaults
		const missingRequired = model.parameters
			.filter((p) => p.required && p.default === null)
			.filter((p) => !(p.name in parameters) || parameters[p.name] === "" || parameters[p.name] === null);

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
				parameters: { ...parameters },
				status: "queued",
				videoUrl: null,
				error: null,
				startTime,
				endTime: null,
				cost: null,
				predictionId: null,
			});

			// Start video generation
			const prediction = await generateVideo(selectedModelId, parameters);
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

