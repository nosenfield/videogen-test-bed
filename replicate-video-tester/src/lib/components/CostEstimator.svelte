<script lang="ts">
	/**
	 * CostEstimator Component
	 * 
	 * Displays estimated and actual costs for video generations.
	 * Calculates cost based on model pricing and parameters.
	 * 
	 * @component
	 * @example
	 * <CostEstimator
	 *   modelId="google/veo-3"
	 *   parameters={{duration: 5}}
	 *   actualCost={0.75}
	 * />
	 */
	import { modelsStore } from "$lib/stores/models";
	import { formatCost } from "$lib/utils/formatting";

	interface Props {
		modelId: string;
		parameters: Record<string, string | number | boolean>;
		actualCost?: number | null;
	}

	let { modelId, parameters, actualCost = null }: Props = $props();

	// Derive model from store
	let model = $derived($modelsStore.find((m) => m.id === modelId));

	// Calculate estimated cost based on model pricing and parameters
	let estimatedCost = $derived.by(() => {
		if (!model || !model.pricing) {
			return null;
		}

		const baseCost = model.pricing.estimatedCost;
		const unit = model.pricing.unit;

		// If pricing is per second, multiply by duration
		if (unit === "per second") {
			const duration = typeof parameters.duration === "number" ? parameters.duration : 5;
			return baseCost * duration;
		}

		// Otherwise, use base cost
		return baseCost;
	});

	// Calculate cost range (±20% variance)
	let costRange = $derived.by(() => {
		if (!estimatedCost) {
			return null;
		}
		const variance = estimatedCost * 0.2;
		return {
			min: estimatedCost - variance,
			max: estimatedCost + variance,
		};
	});

	// Determine which cost to display
	let displayCost = $derived(actualCost ?? estimatedCost);
	let isActual = $derived(actualCost !== null && actualCost !== undefined);
</script>

{#if model}
	<div class="cost-estimator">
		<div class="cost-display">
			<span class="cost-label">{isActual ? "Cost" : "Estimated Cost"}:</span>
			<span class="cost-value" title={isActual ? "Actual cost" : "Estimated cost"}>
				{formatCost(displayCost)}
			</span>
		</div>

		{#if !isActual && costRange}
			<div class="cost-range">
				Range: {formatCost(costRange.min)} - {formatCost(costRange.max)}
			</div>
		{/if}

		{#if model.pricing}
			<div class="cost-breakdown" title="Cost breakdown">
				<div class="breakdown-item">
					<span class="breakdown-label">Base cost:</span>
					<span class="breakdown-value">{formatCost(model.pricing.estimatedCost)}</span>
				</div>
				<div class="breakdown-item">
					<span class="breakdown-label">Unit:</span>
					<span class="breakdown-value">{model.pricing.unit}</span>
				</div>
				{#if model.pricing.unit === "per second" && typeof parameters.duration === "number"}
					<div class="breakdown-item">
						<span class="breakdown-label">Duration:</span>
						<span class="breakdown-value">{parameters.duration}s</span>
					</div>
					<div class="breakdown-item breakdown-total">
						<span class="breakdown-label">Total:</span>
						<span class="breakdown-value">
							{formatCost(model.pricing.estimatedCost * parameters.duration)}
						</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<div class="cost-estimator">
		<div class="cost-display">
			<span class="cost-label">Cost:</span>
			<span class="cost-value">—</span>
		</div>
	</div>
{/if}

<style>
	.cost-estimator {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		background-color: var(--bg-secondary, #f9fafb);
		border-radius: 0.375rem;
		border: 1px solid var(--border, #e5e7eb);
	}

	.cost-display {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.cost-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text, #374151);
	}

	.cost-value {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--primary, #3b82f6);
	}

	.cost-range {
		font-size: 0.75rem;
		color: var(--text, #374151);
		opacity: 0.7;
		text-align: right;
	}

	.cost-breakdown {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--border, #e5e7eb);
		font-size: 0.75rem;
	}

	.breakdown-item {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.breakdown-label {
		color: var(--text, #374151);
		opacity: 0.7;
	}

	.breakdown-value {
		color: var(--text, #374151);
		font-weight: 500;
	}

	.breakdown-total {
		margin-top: 0.25rem;
		padding-top: 0.25rem;
		border-top: 1px solid var(--border, #e5e7eb);
		font-weight: 600;
	}

	.breakdown-total .breakdown-label,
	.breakdown-total .breakdown-value {
		color: var(--primary, #3b82f6);
	}
</style>

