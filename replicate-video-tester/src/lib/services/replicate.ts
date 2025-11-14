/**
 * Replicate API Service
 *
 * Wrapper around the Replicate JavaScript SDK for video generation.
 * Handles client initialization, video generation, status polling, and cancellation.
 */

import Replicate from "replicate";
import type { Prediction, PredictionInput, PredictionOutput } from "../types/replicate.js";
import {
	POLLING_INTERVAL,
	MAX_POLLING_ATTEMPTS,
	INITIAL_POLL_DELAY,
} from "../utils/constants.js";

/**
 * Singleton Replicate client instance
 */
let replicateClient: Replicate | null = null;

/**
 * Initialize Replicate API client with authentication
 * @throws {Error} If API key is missing
 */
export function initializeReplicate(): void {
	const apiKey = import.meta.env.VITE_REPLICATE_API_KEY;

	if (!apiKey || apiKey.trim() === "") {
		throw new Error("Replicate API key is required. Please set VITE_REPLICATE_API_KEY in your .env file.");
	}

	replicateClient = new Replicate({
		auth: apiKey,
	});
}

/**
 * Get the initialized Replicate client instance
 * @returns Replicate client instance
 * @throws {Error} If client has not been initialized
 */
export function getReplicateClient(): Replicate {
	if (!replicateClient) {
		throw new Error("Replicate client not initialized. Call initializeReplicate() first.");
	}

	return replicateClient;
}

/**
 * Generate a video using a Replicate model
 * @param modelId - Model ID (e.g., "google/veo-3")
 * @param parameters - Input parameters for the model
 * @returns Promise that resolves to the Prediction object
 * @throws {Error} If client not initialized or API call fails
 */
export async function generateVideo(
	modelId: string,
	parameters: Record<string, string | number | boolean>
): Promise<Prediction> {
	const replicate = getReplicateClient();

	try {
		const prediction = await replicate.predictions.create({
			model: modelId,
			input: parameters,
		});

		// Map Replicate SDK response to our Prediction interface
		return {
			id: prediction.id,
			status: prediction.status as Prediction["status"],
			input: prediction.input as PredictionInput,
			output: (prediction.output as PredictionOutput) || null,
			error: prediction.error || null,
			logs: prediction.logs || null,
			metrics: prediction.metrics,
			created_at: prediction.created_at,
			started_at: prediction.started_at || null,
			completed_at: prediction.completed_at || null,
			version: prediction.version,
			urls: {
				get: prediction.urls?.get || "",
				cancel: prediction.urls?.cancel || "",
				stream: prediction.urls?.stream,
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
	const replicate = getReplicateClient();

	// Initial delay before first poll
	await new Promise((resolve) => setTimeout(resolve, INITIAL_POLL_DELAY));

	let attempts = 0;

	while (attempts < MAX_POLLING_ATTEMPTS) {
		try {
			const prediction = await replicate.predictions.get(predictionId);

			// Map to our Prediction interface
			const mappedPrediction: Prediction = {
				id: prediction.id,
				status: prediction.status as Prediction["status"],
				input: prediction.input as PredictionInput,
				output: (prediction.output as PredictionOutput) || null,
				error: prediction.error || null,
				logs: prediction.logs || null,
				metrics: prediction.metrics,
				created_at: prediction.created_at,
				started_at: prediction.started_at || null,
				completed_at: prediction.completed_at || null,
				version: prediction.version,
				urls: {
					get: prediction.urls?.get || "",
					cancel: prediction.urls?.cancel || "",
					stream: prediction.urls?.stream,
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
	const replicate = getReplicateClient();

	try {
		await replicate.predictions.cancel(predictionId);
	} catch (error) {
		if (error instanceof Error) {
			const apiError = new Error(`Failed to cancel generation: ${error.message}`);
			apiError.cause = error;
			throw apiError;
		}
		throw new Error(`Failed to cancel generation: ${String(error)}`);
	}
}

/**
 * Reset the client instance (for testing only)
 * @internal
 */
export function resetClient(): void {
	replicateClient = null;
}

