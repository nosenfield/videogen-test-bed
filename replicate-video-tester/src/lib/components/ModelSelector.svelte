<script lang="ts">
	/**
	 * ModelSelector Component
	 * 
	 * Dropdown component for selecting video generation models.
	 * Reactively loads and displays available models from the models store.
	 * Uses template {@const} blocks for automatic reactivity.
	 * 
	 * @component
	 * @example
	 * <ModelSelector
	 *   value="google/veo-3"
	 *   onChange={(modelId) => console.log('Selected:', modelId)}
	 * />
	 */
	import { modelsStore } from "$lib/stores/models";
	import Select from "$lib/components/ui/Select.svelte";
	import type { Model } from "$lib/types/models";

	interface Props {
		/** Currently selected model ID */
		value: string;
		/** Callback when model selection changes */
		onChange: (value: string) => void;
	}

	let { value, onChange }: Props = $props();

	// Format model options for Select component
	// Access store value reactively in template using $modelsStore
	// Options computed in template for automatic reactivity

</script>

{#if $modelsStore && $modelsStore.length > 0}
	{@const options = $modelsStore.map((model) => ({ value: model.id, label: model.name }))}
	{@const modelMap = new Map($modelsStore.map((m) => [m.id, m]))}
	{@const description = modelMap.get(value)?.description || ""}
	<Select
		id="model-select"
		value={value}
		onChange={onChange}
		{options}
		placeholder="Select a model"
		label="Model"
		aria-describedby={value && description ? "model-description" : undefined}
	/>

	{#if value && description}
		<div id="model-description" class="model-description" title={description}>
			{description}
		</div>
	{/if}
{:else}
	<div class="loading-container">
		<Select
			id="model-select"
			value={value}
			onChange={onChange}
			options={[]}
			placeholder="Loading models..."
			label="Model"
			disabled
		/>
		<div class="loading-spinner" role="status" aria-label="Loading models">
			<div class="spinner-circle"></div>
		</div>
	</div>
{/if}

<style>
	.model-description {
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: var(--text);
		opacity: 0.7;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.loading-container {
		position: relative;
	}

	.loading-spinner {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		width: 1rem;
		height: 1rem;
		pointer-events: none;
	}

	.spinner-circle {
		width: 100%;
		height: 100%;
		border: 2px solid var(--border, #e5e7eb);
		border-top-color: var(--primary, #0ea5e9);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

