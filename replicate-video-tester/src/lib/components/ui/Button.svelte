<script lang="ts">
	/**
	 * Button Component
	 * 
	 * Reusable button component with variants, sizes, and icon support.
	 * Fully accessible with keyboard navigation (Enter/Space keys).
	 * 
	 * @component
	 * @example
	 * <Button
	 *   label="Click me"
	 *   onClick={() => console.log('clicked')}
	 *   variant="primary"
	 *   size="md"
	 * />
	 */
	interface Props {
		/** Button label text */
		label: string;
		/** Click handler function */
		onClick?: () => void;
		/** Whether button is disabled */
		disabled?: boolean;
		/** Visual variant (primary, secondary, danger) */
		variant?: "primary" | "secondary" | "danger";
		/** Button size (sm, md, lg) */
		size?: "sm" | "md" | "lg";
		/** Optional icon to display before label */
		icon?: string;
	}

	let {
		label,
		onClick,
		disabled = false,
		variant = "primary",
		size = "md",
		icon,
	}: Props = $props();

	function handleClick() {
		if (!disabled && onClick) {
			onClick();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if ((event.key === "Enter" || event.key === " ") && !disabled && onClick) {
			event.preventDefault();
			onClick();
		}
	}
</script>

<button
	class="button {variant} {size}"
	{disabled}
	onclick={handleClick}
	onkeydown={handleKeydown}
	type="button"
	aria-label={label}
>
	{#if icon}
		<span class="icon">{icon}</span>
	{/if}
	<span class="label">{label}</span>
</button>

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: opacity 0.2s, transform 0.1s;
		font-family: inherit;
	}

	.button:focus {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	.button:active:not(:disabled) {
		transform: scale(0.98);
	}

	.button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Variants */
	.button.primary {
		background: var(--primary);
		color: white;
	}

	.button.primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.button.secondary {
		background: var(--bg-gray);
		color: var(--text);
		border: 1px solid var(--border);
	}

	.button.secondary:hover:not(:disabled) {
		background: #e5e7eb;
	}

	.button.danger {
		background: var(--error);
		color: white;
	}

	.button.danger:hover:not(:disabled) {
		opacity: 0.9;
	}

	/* Sizes */
	.button.sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
		min-height: 36px;
		min-width: 36px;
	}

	.button.md {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		min-height: 44px;
		min-width: 44px;
	}

	.button.lg {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		min-height: 48px;
		min-width: 48px;
	}

	/* Touch-friendly on mobile */
	@media (max-width: 768px) {
		.button.sm {
			min-height: 44px;
			padding: 0.5rem 0.875rem;
		}

		.button.md {
			padding: 0.625rem 1.25rem;
		}

		.button.lg {
			padding: 0.875rem 1.75rem;
		}
	}

	.icon {
		display: inline-flex;
		align-items: center;
	}

	.label {
		display: inline-block;
	}
</style>

