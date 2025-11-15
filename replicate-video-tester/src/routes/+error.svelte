<script lang="ts">
	/**
	 * Error Page
	 * 
	 * Displays error messages for route errors and application failures.
	 * Provides user-friendly error messages and navigation options.
	 */
	import Button from "$lib/components/ui/Button.svelte";
	import { goto } from "$app/navigation";

	interface Props {
		error: Error;
		status?: number;
	}

	let { error, status = 500 }: Props = $props();

	// Get user-friendly error message
	function getUserMessage(error: Error, status: number): string {
		// Handle HTTP status codes
		if (status === 404) {
			return "The page you're looking for doesn't exist.";
		}
		if (status === 500) {
			return "An internal server error occurred. Please try again later.";
		}
		if (status >= 400 && status < 500) {
			return "There was a problem with your request. Please check and try again.";
		}
		if (status >= 500) {
			return "A server error occurred. Please try again later.";
		}

		// Handle specific error types
		if (error.message.includes("Not Found") || error.message.includes("404")) {
			return "The page you're looking for doesn't exist.";
		}
		if (error.message.includes("Network") || error.message.includes("fetch")) {
			return "Network error. Please check your connection and try again.";
		}

		// Default to error message if available, otherwise generic message
		return error.message || "An unexpected error occurred. Please try again.";
	}

	// Get error title based on status
	function getErrorTitle(status: number): string {
		if (status === 404) {
			return "Page Not Found";
		}
		if (status >= 500) {
			return "Server Error";
		}
		if (status >= 400) {
			return "Error";
		}
		return "Something Went Wrong";
	}

	let errorMessage = $derived(getUserMessage(error, status));
	let errorTitle = $derived(getErrorTitle(status));

	// Navigate home
	function handleGoHome() {
		goto("/");
	}

	// Retry current page
	function handleRetry() {
		window.location.reload();
	}
</script>

<div class="error-page">
	<div class="error-content">
		<div class="error-icon" aria-hidden="true">⚠️</div>
		<h1 class="error-title">{errorTitle}</h1>
		<p class="error-message">{errorMessage}</p>

		{#if status}
			<p class="error-status">Error Code: {status}</p>
		{/if}

		<div class="error-actions">
			<Button label="Go Home" onClick={handleGoHome} variant="primary" />
			<Button label="Retry" onClick={handleRetry} variant="secondary" />
		</div>

		{#if import.meta.env.DEV}
			<details class="error-details">
				<summary>Technical Details (Development Only)</summary>
				<pre class="error-stack">{error.stack || error.message}</pre>
			</details>
		{/if}
	</div>
</div>

<style>
	.error-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: 2rem;
	}

	.error-content {
		text-align: center;
		max-width: 600px;
		width: 100%;
	}

	.error-icon {
		font-size: 4rem;
		margin-bottom: 1.5rem;
		opacity: 0.8;
	}

	.error-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text, #1f2937);
		margin: 0 0 1rem 0;
	}

	.error-message {
		font-size: 1.125rem;
		color: var(--text, #1f2937);
		opacity: 0.8;
		margin: 0 0 1.5rem 0;
		line-height: 1.6;
	}

	.error-status {
		font-size: 0.875rem;
		color: var(--text, #1f2937);
		opacity: 0.6;
		margin: 0 0 2rem 0;
		font-family: monospace;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}

	.error-details {
		margin-top: 2rem;
		padding: 1rem;
		background: var(--bg-gray, #f9fafb);
		border: 1px solid var(--border, #e5e7eb);
		border-radius: 0.5rem;
		text-align: left;
	}

	.error-details summary {
		cursor: pointer;
		font-weight: 500;
		color: var(--text, #1f2937);
		margin-bottom: 0.5rem;
	}

	.error-details summary:hover {
		opacity: 0.8;
	}

	.error-stack {
		font-size: 0.75rem;
		color: var(--text, #1f2937);
		opacity: 0.7;
		white-space: pre-wrap;
		word-break: break-all;
		margin: 0;
		padding: 0.5rem;
		background: var(--bg-gray, #f9fafb);
		border-radius: 0.25rem;
		overflow-x: auto;
	}
</style>

