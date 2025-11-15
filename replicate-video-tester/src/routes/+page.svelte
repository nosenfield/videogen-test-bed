<script lang="ts">
	/**
	 * Main Application Page
	 * 
	 * Primary testing interface with multiple ModelRow components.
	 * Manages row lifecycle and enforces concurrent generation limits.
	 */
	import { generationsStore, clearAll, activeCount, removeGeneration } from "$lib/stores/generations";
	import { loadModels } from "$lib/stores/models";
	import { uiStore, setError } from "$lib/stores/ui";
	import ModelRow from "$lib/components/ModelRow.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { onMount } from "svelte";

	// Subscribe to stores (direct subscriptions for reactivity)
	// activeCount is already a derived store, access it directly via $activeCount

	// Local state for row management
	let rowIds = $state<string[]>([]);
	let nextRowId = $state(1);

	// Load models on mount
	onMount(() => {
		try {
			loadModels();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to load models";
			setError(errorMessage);
		}
	});

	// Generate unique row ID
	function generateRowId(): string {
		return `row-${nextRowId++}`;
	}

	// Add a new model row
	function handleAddRow() {
		const newId = generateRowId();
		rowIds = [...rowIds, newId];
	}

	// Remove a model row
	function handleRemoveRow(id: string) {
		rowIds = rowIds.filter((rowId) => rowId !== id);
		// Also remove any associated generation
		const generation = $generationsStore.items.find((gen) => gen.id === id);
		if (generation) {
			removeGeneration(id);
		}
	}

	// Clear all rows and generations
	function handleClearAll() {
		if (confirm("Are you sure you want to clear all rows and generations?")) {
			rowIds = [];
			clearAll();
		}
	}

	/**
	 * Check if we can add more rows (based on concurrent generation limit).
	 * 
	 * Business logic:
	 * - Always allow the first row (initial state, no active generations yet)
	 * - For subsequent rows, only allow if current active generation count is below the limit
	 * - This limits concurrent ACTIVE generations, not total rows
	 * - Users can have multiple rows, but only N can be generating simultaneously
	 */
	let canAddRow = $derived.by(() => {
		const maxConcurrent = $uiStore.maxConcurrentGenerations;
		// Always allow first row (no active generations yet)
		if (rowIds.length === 0) {
			return true;
		}
		// For subsequent rows, enforce concurrent generation limit
		// This prevents starting new generations when limit is reached
		return $activeCount < maxConcurrent;
	});

	// Format session cost
	let formattedCost = $derived(`$${$uiStore.sessionCost.toFixed(4)}`);
</script>

<div class="main-page">
	<div class="page-header">
		<div class="header-content">
			<h2>Video Model Testing</h2>
			<p class="instructions">
				Add model rows to test and compare different video generation models. Each row allows you to
				select a model, configure parameters, and generate videos. You can run up to
				{$uiStore.maxConcurrentGenerations} generations simultaneously.
			</p>
		</div>
		<div class="header-actions">
			<div class="session-info">
				<span class="session-cost">Session Cost: {formattedCost}</span>
				<span class="active-count">
					Active: {$activeCount} / {$uiStore.maxConcurrentGenerations}
				</span>
			</div>
			<Button
				label="Add Model"
				onClick={handleAddRow}
				variant="primary"
				disabled={!canAddRow}
			/>
			{#if rowIds.length > 0}
				<Button label="Clear All" onClick={handleClearAll} variant="danger" size="sm" />
			{/if}
		</div>
	</div>

	<div class="rows-container">
		{#if rowIds.length === 0}
			<div class="empty-state">
				<p>No model rows yet. Click "Add Model" to get started.</p>
			</div>
		{:else}
			{#each rowIds as rowId (rowId)}
				<ModelRow id={rowId} onRemove={handleRemoveRow} />
			{/each}
		{/if}
	</div>

	{#if !canAddRow && rowIds.length > 0}
		<div class="limit-warning" role="alert">
			<p>
				<span aria-hidden="true">⚠️</span>
				<span class="sr-only">Warning:</span>
				Maximum concurrent generations reached ({$activeCount}/
				{$uiStore.maxConcurrentGenerations}). Complete or cancel existing generations before adding
				more rows.
			</p>
		</div>
	{/if}
</div>

<style>
	.main-page {
		width: 100%;
	}

	.page-header {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border, #e5e7eb);
	}

	.header-content {
		margin-bottom: 1rem;
	}

	.page-header h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text, #1f2937);
		margin: 0 0 0.5rem 0;
	}

	.instructions {
		font-size: 0.875rem;
		color: var(--text, #1f2937);
		opacity: 0.7;
		line-height: 1.6;
		margin: 0;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.session-info {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		font-size: 0.875rem;
		color: var(--text, #1f2937);
	}

	@media (max-width: 768px) {
		.page-header {
			margin-bottom: 1.5rem;
			padding-bottom: 1rem;
		}

		.page-header h2 {
			font-size: 1.25rem;
		}

		.instructions {
			font-size: 0.8125rem;
		}

		.header-actions {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}

		.session-info {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}

	@media (max-width: 375px) {
		.page-header h2 {
			font-size: 1.125rem;
		}

		.instructions {
			font-size: 0.75rem;
		}
	}

	.session-cost {
		font-weight: 500;
	}

	.active-count {
		opacity: 0.7;
	}

	.rows-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text, #1f2937);
		opacity: 0.6;
	}

	.limit-warning {
		margin-top: 1.5rem;
		padding: 1rem;
		background: var(--warning, #f59e0b);
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid var(--warning, #f59e0b);
		border-radius: 0.5rem;
		color: var(--text, #1f2937);
	}

	.limit-warning p {
		margin: 0;
		font-size: 0.875rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
