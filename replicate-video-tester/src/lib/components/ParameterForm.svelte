<script lang="ts">
	/**
	 * ParameterForm Component
	 * 
	 * Uncontrolled form component for dynamically rendering model parameters.
	 * 
	 * **Component Contract:**
	 * - Component manages its own state (localParams) - uncontrolled pattern
	 * - Parent provides initial values via `parameters` prop (only used on first mount)
	 * - Parent receives updates via `onChange` callback on user interactions
	 * - Parent should NOT update `parameters` prop after mount (changes are ignored)
	 * - Component re-initializes only when `modelId` changes
	 * 
	 * **Why Uncontrolled?**
	 * This component uses an uncontrolled pattern (deviating from best-practices recommendation
	 * for controlled components) because:
	 * - Parameter sets can be large and complex
	 * - Parent doesn't need to manage every keystroke
	 * - Component handles defaults and validation internally
	 * - Reduces prop drilling and parent state management complexity
	 * 
	 * @component
	 * @example
	 * <ParameterForm
	 *   modelId="google/veo-3"
	 *   parameters={{prompt: "A sunset"}}  // Initial values only
	 *   onChange={(params) => console.log(params)}  // Called on user input
	 * />
	 */
	import { modelsStore } from "$lib/stores/models";
	import Input from "$lib/components/ui/Input.svelte";
	import Select from "$lib/components/ui/Select.svelte";
	import { validateParameter } from "$lib/utils/validation";
	import type { ModelParameter } from "$lib/types/models";

	interface Props {
		modelId: string;
		parameters: Record<string, string | number | boolean>;
		onChange: (parameters: Record<string, string | number | boolean>) => void;
	}

	let { modelId, parameters, onChange }: Props = $props();

	// Derive models once to avoid repeated store subscriptions
	let models = $derived($modelsStore);
	let currentModel = $derived(models.find((m) => m.id === modelId));

	// Local state for parameter values with defaults
	let localParams = $state<Record<string, string | number | boolean>>({});

	// Validation errors
	let errors = $state<Record<string, string>>({});

	// Track last modelId to detect model changes
	let lastModelId = $state<string | null>(null);
	let isInitialized = $state(false);

	// Initialize local params when modelId changes
	// Component is uncontrolled - manages its own state, only notifies parent via onChange
	// Only uses parameters prop for initial values, then ignores subsequent prop changes
	// Effect only tracks modelId and currentModel, not parameters prop (prevents infinite loops)
	$effect(() => {
		// Only re-initialize if modelId changed (not if parameters prop changes)
		if (lastModelId === modelId && isInitialized) {
			return;
		}
		
		// Don't initialize if model hasn't loaded yet (prevents race condition)
		if (!currentModel) {
			return;
		}
		
		const paramDefinitions = currentModel.parameters || [];
		const newParams: Record<string, string | number | boolean> = {};
		
		// Initialize with provided parameters (for initial values) or defaults
		// Only use parameters prop on first initialization, then ignore it
		// Note: Missing required parameters without defaults will trigger validation errors
		for (const param of paramDefinitions) {
			if (!isInitialized && param.name in parameters && parameters[param.name] !== null && parameters[param.name] !== undefined) {
				// Use provided initial value (only on first mount)
				newParams[param.name] = parameters[param.name];
			} else if (param.default !== null && param.default !== undefined) {
				// Use default from model definition
				newParams[param.name] = param.default as string | number | boolean;
			}
			// If no value provided and no default, parameter is undefined (triggers required validation)
		}
		
		// Update state immutably
		localParams = { ...newParams };
		lastModelId = modelId;
		isInitialized = true;
		
		// Validate required fields on initialization
		validateRequiredFields();
		
		// Note: onChange is NOT called here to prevent infinite loops
		// If parent updates parameters prop in response to onChange, it would trigger
		// re-initialization, creating a circular update loop. Parent should only pass
		// initial parameters, not update them after mount. Subsequent parameter prop
		// changes are ignored (truly uncontrolled pattern).
	});

	// Validate required fields (called on initialization and parameter changes)
	function validateRequiredFields() {
		if (!currentModel) return;
		
		const paramDefinitions = currentModel.parameters || [];
		const newErrors: Record<string, string> = {};
		
		// Validate required parameters
		for (const param of paramDefinitions) {
			const value = localParams[param.name];
			// Check if required field is missing or empty
			if (param.required && (value === undefined || value === null || value === "")) {
				newErrors[param.name] = `${param.name} is required`;
			}
		}
		
		// Update errors immutably
		errors = newErrors;
	}

	// Handle parameter value change
	function handleParameterChange(paramName: string, value: string | number | boolean) {
		// Update local state immutably
		localParams = { ...localParams, [paramName]: value };

		// Validate in real-time
		if (currentModel) {
			const param = currentModel.parameters.find((p) => p.name === paramName);
			if (param) {
				const validation = validateParameter(value, param);
				// Update errors immutably
				if (!validation.valid && validation.error) {
					errors = { ...errors, [paramName]: validation.error };
				} else {
					// Remove error immutably
					const { [paramName]: _, ...rest } = errors;
					errors = rest;
				}
			}
		}
		
		// Notify parent of change with updated params
		onChange({ ...localParams });
	}

	// Get parameter value for display
	function getParamValue(paramName: string): string {
		const value = localParams[paramName];
		if (value === undefined || value === null) {
			return "";
		}
		return String(value);
	}

	// Get parameter value as number
	function getParamValueAsNumber(paramName: string): number {
		const value = localParams[paramName];
		if (typeof value === "number") {
			return value;
		}
		if (typeof value === "string") {
			const num = parseFloat(value);
			return isNaN(num) ? 0 : num;
		}
		return 0;
	}

	// Get parameter value as boolean
	function getParamValueAsBoolean(paramName: string): boolean {
		const value = localParams[paramName];
		if (typeof value === "boolean") {
			return value;
		}
		return false;
	}
</script>

{#if currentModel}
	{@const paramDefinitions = currentModel.parameters || []}
	<form class="parameter-form">
		{#each paramDefinitions as param (param.name)}
		<div class="parameter-field">
			{#if param.type === "string"}
				<Input
					label={param.name + (param.required ? " *" : "")}
					value={getParamValue(param.name)}
					onChange={(value) => handleParameterChange(param.name, value)}
					placeholder={param.description}
					error={errors[param.name]}
					type="text"
				/>
			{:else if param.type === "number"}
				<Input
					label={param.name + (param.required ? " *" : "")}
					value={getParamValue(param.name)}
					onChange={(value) => {
						// Handle empty string - remove parameter to trigger validation
						if (value.trim() === "") {
							// Remove parameter and validate (uses consistent validation path)
							const updatedParams = { ...localParams };
							delete updatedParams[param.name];
							localParams = updatedParams;
							validateRequiredFields();
							onChange({ ...updatedParams });
						} else {
							const num = parseFloat(value);
							if (!isNaN(num)) {
								// Use standard handleParameterChange for consistency
								handleParameterChange(param.name, num);
							}
						}
					}}
					placeholder={param.description}
					error={errors[param.name]}
					type="number"
				/>
			{:else if param.type === "boolean"}
				<div class="checkbox-field">
					<label>
						<input
							type="checkbox"
							checked={getParamValueAsBoolean(param.name)}
							onchange={(e) =>
								handleParameterChange(param.name, (e.target as HTMLInputElement).checked)
							}
						/>
						<span class="checkbox-label">
							{param.name}
							{#if param.required}
								<span class="required">*</span>
							{/if}
						</span>
					</label>
					{#if param.description}
						<p class="parameter-description">{param.description}</p>
					{/if}
					{#if errors[param.name]}
						<p class="error-message">{errors[param.name]}</p>
					{/if}
				</div>
			{:else if param.type === "select" && param.options}
				<div class="select-field">
					<Select
						label={param.name + (param.required ? " *" : "")}
						value={getParamValue(param.name)}
						onChange={(value) => handleParameterChange(param.name, value)}
						options={param.options.map((opt) => ({
							value: String(opt.value),
							label: opt.label,
						}))}
						placeholder={param.description}
					/>
					{#if errors[param.name]}
						<p class="error-message">{errors[param.name]}</p>
					{/if}
				</div>
			{/if}
		</div>
		{/each}
	</form>
{:else if models.length === 0}
	<div class="no-model">Loading models...</div>
{:else}
	<div class="no-model">No model selected</div>
{/if}

<style>
	.parameter-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.parameter-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.select-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.checkbox-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.checkbox-field label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.checkbox-label {
		font-size: 0.875rem;
		color: var(--text);
	}

	.required {
		color: var(--error, #ef4444);
		margin-left: 0.25rem;
	}

	.parameter-description {
		font-size: 0.75rem;
		color: var(--text);
		opacity: 0.7;
		margin-left: 1.5rem;
	}

	.error-message {
		font-size: 0.75rem;
		color: var(--error, #ef4444);
		margin-top: 0.25rem;
	}

	.no-model {
		padding: 1rem;
		text-align: center;
		color: var(--text);
		opacity: 0.7;
	}
</style>

