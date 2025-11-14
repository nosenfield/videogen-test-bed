<script lang="ts">
	interface SelectOption {
		value: string;
		label: string;
	}

	interface Props {
		value: string;
		onChange: (value: string) => void;
		options: SelectOption[];
		disabled?: boolean;
		placeholder?: string;
		label?: string;
		id?: string;
	}

	let {
		value,
		onChange,
		options,
		disabled = false,
		placeholder,
		label,
		id,
	}: Props = $props();

	// Generate unique ID once per component instance (not reactive)
	function generateId(): string {
		if (typeof crypto !== "undefined" && crypto.randomUUID) {
			return `select-${crypto.randomUUID()}`;
		}
		return `select-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
	}
	const generatedId = generateId();
	const selectId = $derived(id || generatedId);

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		onChange(target.value);
	}
</script>

<div class="select-wrapper">
	{#if label}
		<label for={selectId} class="label">{label}</label>
	{/if}
	<select
		id={selectId}
		class="select"
		{value}
		{disabled}
		onchange={handleChange}
	>
		{#if placeholder && !value}
			<option value="" disabled>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>

<style>
	.select-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		width: 100%;
	}

	.label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text);
		margin-bottom: 0.25rem;
	}

	.select {
		width: 100%;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		padding: 0.5rem;
		font-size: 0.875rem;
		font-family: inherit;
		background: white;
		color: var(--text);
		cursor: pointer;
		transition: border-color 0.2s, outline 0.2s;
	}

	.select:focus {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
		border-color: var(--primary);
	}

	.select:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--bg-gray);
	}
</style>

