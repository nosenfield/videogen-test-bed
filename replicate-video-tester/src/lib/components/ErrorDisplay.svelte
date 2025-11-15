<script lang="ts">
	/**
	 * ErrorDisplay Component
	 * 
	 * Displays error messages with consistent styling and dismiss functionality.
	 * Supports different severity levels and optional auto-dismiss.
	 * 
	 * @component
	 * @example
	 * <ErrorDisplay
	 *   error="Something went wrong"
	 *   onDismiss={() => console.log('dismissed')}
	 *   severity="error"
	 * />
	 */
	interface Props {
		error: string | null | undefined;
		onDismiss?: () => void;
		severity?: "error" | "warning" | "info";
		autoDismiss?: number; // Auto-dismiss after milliseconds (optional)
	}

	let { error, onDismiss, severity = "error", autoDismiss }: Props = $props();

	// Auto-dismiss timer
	$effect(() => {
		if (!error || !autoDismiss || !onDismiss) {
			return;
		}

		const timer = setTimeout(() => {
			onDismiss();
		}, autoDismiss);

		return () => clearTimeout(timer);
	});

	// Get severity styling
	let severityClass = $derived(`error-${severity}`);
	let severityColor = $derived.by(() => {
		switch (severity) {
			case "error":
				return "var(--error, #ef4444)";
			case "warning":
				return "var(--warning, #f59e0b)";
			case "info":
				return "var(--info, #3b82f6)";
			default:
				return "var(--error, #ef4444)";
		}
	});

	function handleDismiss() {
		if (onDismiss) {
			onDismiss();
		}
	}
</script>

{#if error}
	<div class="error-display {severityClass}" style="--severity-color: {severityColor}" role="alert">
		<div class="error-content">
			<span class="error-icon" aria-hidden="true">⚠</span>
			<span class="error-message">{error}</span>
		</div>
		{#if onDismiss}
			<button
				class="dismiss-button"
				onclick={handleDismiss}
				aria-label="Dismiss error"
				type="button"
			>
				×
			</button>
		{/if}
	</div>
{/if}

<style>
	.error-display {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background-color: color-mix(in srgb, var(--severity-color) 10%, white);
		border: 1px solid var(--severity-color);
		border-radius: 0.375rem;
		color: var(--text, #374151);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.error-content {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		flex: 1;
	}

	.error-icon {
		font-size: 1.125rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.error-message {
		flex: 1;
		word-wrap: break-word;
	}

	.dismiss-button {
		background: none;
		border: none;
		color: var(--text, #374151);
		cursor: pointer;
		font-size: 1.5rem;
		line-height: 1;
		padding: 0;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25rem;
		flex-shrink: 0;
		transition: background-color 0.2s;
	}

	.dismiss-button:hover {
		background-color: color-mix(in srgb, var(--severity-color) 20%, white);
	}

	.dismiss-button:focus {
		outline: 2px solid var(--severity-color);
		outline-offset: 2px;
	}

	.dismiss-button:active {
		background-color: color-mix(in srgb, var(--severity-color) 30%, white);
	}
</style>

