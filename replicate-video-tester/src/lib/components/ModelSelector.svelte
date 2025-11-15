<script lang="ts">
	import { modelsStore } from "$lib/stores/models";
	import Select from "$lib/components/ui/Select.svelte";
	import type { Model } from "$lib/types/models";

	interface Props {
		value: string;
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
	<Select
		id="model-select"
		value={value}
		onChange={onChange}
		options={[]}
		placeholder="Loading models..."
		label="Model"
		disabled
	/>
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
</style>

