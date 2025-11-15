<script lang="ts">
	/**
	 * GenerationStatus Component
	 * 
	 * Visual indicator of generation progress with status badge, elapsed time,
	 * and progress spinner for active states.
	 * 
	 * @component
	 * @example
	 * <GenerationStatus
	 *   status="processing"
	 *   startTime={Date.now()}
	 *   estimatedTime={30}
	 * />
	 */
	import { formatElapsedTime } from "$lib/utils/formatting";
	import { STATUS_COLORS } from "$lib/utils/constants";
	import type { GenerationStatus } from "$lib/types/generation";

	interface Props {
		status: GenerationStatus;
		startTime?: number | null;
		estimatedTime?: number | null; // Estimated time remaining in seconds
	}

	let { status, startTime = null, estimatedTime = null }: Props = $props();

	// Real-time elapsed time counter
	let currentTime = $state(Date.now());

	// Update elapsed time every second for active states
	$effect(() => {
		if (status !== "queued" && status !== "processing") {
			return;
		}

		const interval = setInterval(() => {
			currentTime = Date.now();
		}, 1000);

		return () => clearInterval(interval);
	});

	// Compute elapsed time
	let elapsedTime = $derived(formatElapsedTime(startTime));

	// Compute estimated time remaining
	let timeRemaining = $derived.by(() => {
		if (!estimatedTime || !startTime) {
			return null;
		}
		const elapsed = Math.max(0, Math.floor((currentTime - startTime) / 1000));
		const remaining = Math.max(0, estimatedTime - elapsed);
		return remaining;
	});

	// Format time remaining
	let timeRemainingText = $derived.by(() => {
		if (timeRemaining === null) {
			return null;
		}
		if (timeRemaining === 0) {
			return "Almost done...";
		}
		return `~${timeRemaining}s remaining`;
	});

	// Get status color
	let statusColor = $derived(STATUS_COLORS[status] || STATUS_COLORS.idle);

	// Get status label
	let statusLabel = $derived.by(() => {
		switch (status) {
			case "idle":
				return "Idle";
			case "queued":
				return "Queued";
			case "processing":
				return "Processing";
			case "completed":
				return "Completed";
			case "error":
				return "Error";
			case "canceled":
				return "Canceled";
			default:
				return "Unknown";
		}
	});

	// Check if status is active (needs spinner)
	let isActive = $derived(status === "queued" || status === "processing");
</script>

<div class="generation-status">
	<div class="status-badge" style="--status-color: {statusColor}">
		{#if isActive}
			<div class="spinner" aria-label="Processing" role="status">
				<div class="spinner-circle"></div>
			</div>
		{/if}
		<span class="status-label">{statusLabel}</span>
	</div>

	{#if startTime && (status === "queued" || status === "processing")}
		<div class="time-info">
			<span class="elapsed-time">Elapsed: {elapsedTime}</span>
			{#if timeRemainingText}
				<span class="estimated-time">{timeRemainingText}</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.generation-status {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		border-radius: 0.375rem;
		background-color: var(--status-color);
		color: white;
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.25rem;
	}

	.status-label {
		text-transform: capitalize;
	}

	.spinner {
		display: inline-block;
		width: 0.875rem;
		height: 0.875rem;
		position: relative;
	}

	.spinner-circle {
		width: 100%;
		height: 100%;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.time-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.75rem;
		color: var(--text, #374151);
		opacity: 0.7;
	}

	.elapsed-time {
		font-weight: 500;
	}

	.estimated-time {
		font-style: italic;
	}
</style>

