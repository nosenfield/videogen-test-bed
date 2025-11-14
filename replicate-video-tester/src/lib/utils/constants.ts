/**
 * Application-wide constants
 *
 * Centralized constants used throughout the application.
 * Avoids magic numbers and strings scattered across the codebase.
 */

/**
 * Maximum number of concurrent video generations
 */
export const MAX_CONCURRENT_GENERATIONS = 5;

/**
 * Polling interval in milliseconds
 * How often to check prediction status
 */
export const POLLING_INTERVAL = 3000;

/**
 * Maximum number of polling attempts before giving up
 */
export const MAX_POLLING_ATTEMPTS = 400;

/**
 * Initial delay before first poll (milliseconds)
 * Gives the API time to queue the prediction
 */
export const INITIAL_POLL_DELAY = 2000;

/**
 * Status color mappings
 * Maps generation status to CSS color values
 */
export const STATUS_COLORS: Record<string, string> = {
	idle: "#6b7280", // gray
	queued: "#3b82f6", // blue
	processing: "#f59e0b", // amber
	completed: "#10b981", // green
	error: "#ef4444", // red
	canceled: "#9ca3af", // gray
};

