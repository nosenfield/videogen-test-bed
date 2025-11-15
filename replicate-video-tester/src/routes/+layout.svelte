<script lang="ts">
	/**
	 * Root Layout
	 * 
	 * Application-wide layout with global styles, header, and error handling.
	 * Provides consistent structure across all pages.
	 */
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { uiStore, clearError } from "$lib/stores/ui";
	import ErrorDisplay from "$lib/components/ErrorDisplay.svelte";

	let { children } = $props();

	// Subscribe to UI store for global state
	let uiState = $derived($uiStore);
</script>

<svelte:head>
	<title>Replicate Video Model Tester</title>
	<link rel="icon" href={favicon} />
	<meta name="description" content="Test and compare video generation models from Replicate" />
</svelte:head>

<div class="app-container">
	<header class="app-header">
		<div class="header-content">
			<h1 class="app-title">Replicate Video Model Tester</h1>
			<p class="app-subtitle">Test and compare video generation models</p>
		</div>
	</header>

	<main class="app-main">
		<!-- Global Error Display -->
		{#if uiState.globalError}
			<div class="global-error-container">
				<ErrorDisplay error={uiState.globalError} onDismiss={() => clearError()} />
			</div>
		{/if}

		<!-- Global Loading Indicator -->
		{#if uiState.isLoading}
			<div class="global-loading" role="status" aria-label="Loading">
				<div class="spinner"></div>
				<span>Loading...</span>
			</div>
		{/if}

		<!-- Page Content -->
		<div class="page-content">
			{@render children()}
		</div>
	</main>

	<footer class="app-footer">
		<div class="footer-content">
			<p>Session Cost: ${uiState.sessionCost.toFixed(4)}</p>
		</div>
	</footer>
</div>

<style>
	.app-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.app-header {
		background: var(--bg-gray, #f9fafb);
		border-bottom: 1px solid var(--border, #e5e7eb);
		padding: 1.5rem 2rem;
	}

	.header-content {
		max-width: 1400px;
		margin: 0 auto;
	}

	.app-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text, #1f2937);
		margin: 0 0 0.25rem 0;
	}

	.app-subtitle {
		font-size: 0.875rem;
		color: var(--text, #1f2937);
		opacity: 0.7;
		margin: 0;
	}

	.app-main {
		flex: 1;
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	.global-error-container {
		margin-bottom: 1.5rem;
	}

	.global-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		background: var(--bg-gray, #f9fafb);
		border-radius: 0.5rem;
		border: 1px solid var(--border, #e5e7eb);
	}

	.spinner {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid var(--border, #e5e7eb);
		border-top-color: var(--primary, #0ea5e9);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.page-content {
		width: 100%;
	}

	.app-footer {
		background: var(--bg-gray, #f9fafb);
		border-top: 1px solid var(--border, #e5e7eb);
		padding: 1rem 2rem;
		margin-top: auto;
	}

	.footer-content {
		max-width: 1400px;
		margin: 0 auto;
		text-align: center;
		font-size: 0.875rem;
		color: var(--text, #1f2937);
		opacity: 0.7;
	}
</style>
