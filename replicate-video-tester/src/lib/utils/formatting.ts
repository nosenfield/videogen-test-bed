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

