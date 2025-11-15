/**
 * Replicate API Service
 *
 * Client-side wrapper for Replicate API calls via SvelteKit API routes.
 * All API calls are proxied through server-side routes to avoid CORS issues.
 * Handles video generation, status polling, and cancellation.
 */

import type { Prediction, PredictionInput, PredictionOutput } from "../types/replicate.js";
import {
	POLLING_INTERVAL,
	MAX_POLLING_ATTEMPTS,
	INITIAL_POLL_DELAY,
} from "../utils/constants.js";

/**
 * Type guard to validate API response matches Prediction interface
 * @param obj - Unknown object to validate
 * @returns True if object matches Prediction structure
 */
function isPrediction(obj: unknown): obj is Prediction {
	if (typeof obj !== "object" || obj === null) {
		return false;
	}
	const record = obj as Record<string, unknown>;
	return (
		"id" in record &&
		"status" in record &&
		typeof record.id === "string" &&
		typeof record.status === "string"
	);
}

/**
 * Initialize Replicate API client (no-op for client-side, validation only)
 * @throws {Error} If API key is missing (for user feedback)
 */
export function initializeReplicate(): void {
	// Client-side validation - actual API key is on server
	// This function exists for compatibility with existing code
	// The server will handle actual authentication
}

/**
 * Generate a video using a Replicate model
 * @param modelId - Model ID (e.g., "google/veo-3")
 * @param parameters - Input parameters for the model
 * @returns Promise that resolves to the Prediction object
 * @throws {Error} If API call fails
 */
export async function generateVideo(
	modelId: string,
	parameters: Record<string, string | number | boolean>
): Promise<Prediction> {
	try {
		const response = await fetch("/api/replicate/predictions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ modelId, parameters }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
			throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();

		// Validate response structure
		if (!isPrediction(data)) {
			throw new Error("Invalid API response: missing required fields");
		}

		// Map API response to our Prediction interface
		return {
			id: data.id,
			status: data.status,
			input: data.input as PredictionInput,
			output: (data.output as PredictionOutput) || null,
			error: data.error || null,
			logs: data.logs || null,
			metrics: data.metrics,
			created_at: data.created_at,
			started_at: data.started_at || null,
			completed_at: data.completed_at || null,
			version: data.version,
			urls: {
				get: data.urls?.get || "",
				cancel: data.urls?.cancel || "",
				stream: data.urls?.stream,
			},
		};
	} catch (error) {
		// Re-throw with more context, preserving original error
		if (error instanceof Error) {
			const apiError = new Error(`Failed to start video generation: ${error.message}`);
			apiError.cause = error;
			throw apiError;
		}
		throw new Error(`Failed to start video generation: ${String(error)}`);
	}
}

/**
 * Poll for generation status until completion
 * @param predictionId - Prediction ID to poll
 * @param onUpdate - Callback called on each status update
 * @returns Promise that resolves to the final Prediction
 * @throws {Error} If polling times out or API call fails
 */
export async function pollGenerationStatus(
	predictionId: string,
	onUpdate: (prediction: Prediction) => void
): Promise<Prediction> {
	// Initial delay before first poll
	await new Promise((resolve) => setTimeout(resolve, INITIAL_POLL_DELAY));

	let attempts = 0;

	while (attempts < MAX_POLLING_ATTEMPTS) {
		try {
			const response = await fetch(`/api/replicate/predictions/${predictionId}`);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
				throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			// Validate response structure
			if (!isPrediction(data)) {
				throw new Error("Invalid API response: missing required fields");
			}

			// Map to our Prediction interface
			const mappedPrediction: Prediction = {
				id: data.id,
				status: data.status,
				input: data.input as PredictionInput,
				output: (data.output as PredictionOutput) || null,
				error: data.error || null,
				logs: data.logs || null,
				metrics: data.metrics,
				created_at: data.created_at,
				started_at: data.started_at || null,
				completed_at: data.completed_at || null,
				version: data.version,
				urls: {
					get: data.urls?.get || "",
					cancel: data.urls?.cancel || "",
					stream: data.urls?.stream,
				},
			};

			// Call update callback
			onUpdate(mappedPrediction);

			// Check if completed
			if (
				mappedPrediction.status === "succeeded" ||
				mappedPrediction.status === "failed" ||
				mappedPrediction.status === "canceled"
			) {
				return mappedPrediction;
			}

			// Wait before next poll
			await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
			attempts++;
		} catch (error) {
			if (error instanceof Error) {
				const apiError = new Error(`Failed to poll generation status: ${error.message}`);
				apiError.cause = error;
				throw apiError;
			}
			throw new Error(`Failed to poll generation status: ${String(error)}`);
		}
	}

	// Timeout reached
	throw new Error(
		`Polling timeout: Generation did not complete within ${MAX_POLLING_ATTEMPTS} attempts`
	);
}

/**
 * Cancel an ongoing generation
 * @param predictionId - Prediction ID to cancel
 * @returns Promise that resolves when cancellation is complete
 * @throws {Error} If cancellation fails
 */
export async function cancelGeneration(predictionId: string): Promise<void> {
	try {
		const response = await fetch(`/api/replicate/predictions/${predictionId}/cancel`, {
			method: "POST",
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
			throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
		}
	} catch (error) {
		if (error instanceof Error) {
			const apiError = new Error(`Failed to cancel generation: ${error.message}`);
			apiError.cause = error;
			throw apiError;
		}
		throw new Error(`Failed to cancel generation: ${String(error)}`);
	}
}

