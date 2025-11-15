/**
 * Formatting Utilities
 *
 * Functions for formatting data for display in the UI.
 * Handles edge cases like null, undefined, and zero values.
 */

/**
 * Format cost in USD with 4 decimal places
 * @param cost - Cost in USD (can be null or undefined)
 * @returns Formatted cost string (e.g., "$0.1234")
 */
export function formatCost(cost: number | null | undefined): string {
	if (cost === null || cost === undefined) {
		return "$0.0000";
	}
	return `$${cost.toFixed(4)}`;
}

/**
 * Format duration in seconds as MM:SS
 * @param seconds - Duration in seconds (can be null or undefined)
 * @returns Formatted duration string (e.g., "01:30")
 */
export function formatDuration(seconds: number | null | undefined): string {
	if (seconds === null || seconds === undefined) {
		return "00:00";
	}
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format timestamp as readable date
 * @param timestamp - Unix timestamp in milliseconds (can be null or undefined)
 * @returns Formatted date string or "—" if null/undefined
 */
export function formatTimestamp(timestamp: number | null | undefined): string {
	if (timestamp === null || timestamp === undefined) {
		return "—";
	}
	const date = new Date(timestamp);
	return date.toLocaleDateString();
}

/**
 * Format elapsed time from a start timestamp
 * @param startTime - Start timestamp in milliseconds (can be null or undefined)
 * @returns Formatted elapsed time string (e.g., "5s") or "—" if null/undefined
 */
export function formatElapsedTime(startTime: number | null | undefined): string {
	if (startTime === null || startTime === undefined) {
		return "—";
	}
	const now = Date.now();
	const elapsed = Math.max(0, Math.floor((now - startTime) / 1000));
	return `${elapsed}s`;
}

/**
 * Format error message to be user-friendly
 * Detects common error types and provides helpful messages
 * @param error - Error object or string
 * @returns User-friendly error message
 */
export function formatErrorMessage(error: unknown): string {
	if (!error) {
		return "An unexpected error occurred. Please try again.";
	}

	const errorMessage = error instanceof Error ? error.message : String(error);
	const lowerMessage = errorMessage.toLowerCase();

	// API key errors
	if (
		lowerMessage.includes("api key") ||
		lowerMessage.includes("authentication") ||
		lowerMessage.includes("unauthorized") ||
		lowerMessage.includes("401")
	) {
		return "API key is missing or invalid. Please check your configuration in the .env file.";
	}

	// Rate limit errors
	if (
		lowerMessage.includes("rate limit") ||
		lowerMessage.includes("too many requests") ||
		lowerMessage.includes("429") ||
		lowerMessage.includes("quota")
	) {
		return "Rate limit exceeded. Please wait a moment and try again.";
	}

	// Polling timeout (check before general timeout)
	if (lowerMessage.includes("polling timeout")) {
		return "Generation is taking longer than expected. The request may still be processing on the server.";
	}

	// Network errors (check before general timeout)
	if (
		lowerMessage.includes("network") ||
		lowerMessage.includes("fetch") ||
		lowerMessage.includes("connection") ||
		lowerMessage.includes("failed to fetch")
	) {
		return "Network error. Please check your internet connection and try again.";
	}

	// Validation errors
	if (
		lowerMessage.includes("invalid") ||
		lowerMessage.includes("validation") ||
		lowerMessage.includes("required") ||
		lowerMessage.includes("missing")
	) {
		return errorMessage; // Keep validation errors as-is since they're usually specific
	}

	// Timeout errors (general)
	if (lowerMessage.includes("timeout") || lowerMessage.includes("timed out")) {
		return "The request took too long. Please try again.";
	}

	// Default: return original message if it's reasonable, otherwise generic message
	if (errorMessage.length > 0 && errorMessage.length < 200) {
		return errorMessage;
	}

	return "An unexpected error occurred. Please try again.";
}

