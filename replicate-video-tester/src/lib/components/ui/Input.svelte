<script lang="ts">
	/**
	 * Input Component
	 * 
	 * Text input component with validation, error display, and accessibility support.
	 * Generates unique IDs automatically if not provided.
	 * 
	 * @component
	 * @example
	 * <Input
	 *   value={text}
	 *   onChange={(val) => text = val}
	 *   label="Name"
	 *   placeholder="Enter your name"
	 *   error={errors.name}
	 * />
	 */
	interface Props {
		/** Input value (controlled) */
		value: string;
		/** Change handler */
		onChange: (value: string) => void;
		/** Input type */
		type?: "text" | "number" | "password" | "email" | "url";
		/** Placeholder text */
		placeholder?: string;
		/** Whether input is disabled */
		disabled?: boolean;
		/** Error message to display */
		error?: string;
		/** Label text */
		label?: string;
		/** Optional custom ID (auto-generated if not provided) */
		id?: string;
	}

	let {
		value,
		onChange,
		type = "text",
		placeholder,
		disabled = false,
		error,
		label,
		id,
	}: Props = $props();

	// Generate unique ID once per component instance (not reactive)
	function generateId(): string {
		// Use crypto.randomUUID if available, otherwise fallback to timestamp
		if (typeof crypto !== "undefined" && crypto.randomUUID) {
			return `input-${crypto.randomUUID()}`;
		}
		return `input-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
	}
	// Store generated ID in a closure to ensure it's only created once
	const generatedId = generateId();
	// Use provided id if available, otherwise use generated one
	const inputId = $derived(id || generatedId);

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onChange(target.value);
	}
</script>

<div class="input-wrapper">
	{#if label}
		<label for={inputId} class="label">{label}</label>
	{/if}
	<input
		id={inputId}
		class="input {error ? 'error' : ''}"
		type={type}
		{value}
		{placeholder}
		{disabled}
		oninput={handleInput}
		aria-invalid={error ? "true" : undefined}
		aria-describedby={error ? `${inputId}-error` : undefined}
	/>
	{#if error}
		<span id="{inputId}-error" class="error-message" role="alert">{error}</span>
	{/if}
</div>

<style>
	.input-wrapper {
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

	.input {
		width: 100%;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		padding: 0.5rem;
		font-size: 0.875rem;
		font-family: inherit;
		transition: border-color 0.2s, outline 0.2s;
		background: white;
		color: var(--text);
	}

	.input:focus {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
		border-color: var(--primary);
	}

	.input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--bg-gray);
	}

	.input.error {
		border-color: var(--error);
	}

	.input.error:focus {
		outline-color: var(--error);
		border-color: var(--error);
	}

	.error-message {
		font-size: 0.75rem;
		color: var(--error);
		margin-top: 0.25rem;
	}
</style>

