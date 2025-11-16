import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getReplicateClient } from '$lib/server/replicate-auth.js';
import type Replicate from 'replicate';

/**
 * Retry configuration for transient errors
 */
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // Start with 1 second
const RETRYABLE_STATUS_CODES = [502, 503, 504]; // Bad Gateway, Service Unavailable, Gateway Timeout

/**
 * Check if an error is a retryable API error
 * Replicate SDK ApiError has structure: { response: { status: number, statusText: string }, ... }
 */
function isRetryableError(error: unknown): boolean {
	if (error && typeof error === 'object') {
		// Check for Replicate SDK ApiError structure
		const apiError = error as { response?: { status?: number } };
		if (apiError.response?.status && RETRYABLE_STATUS_CODES.includes(apiError.response.status)) {
			return true;
		}
	}
	return false;
}

/**
 * Extract HTTP status code from Replicate API error
 * Replicate SDK ApiError has structure: { response: { status: number, statusText: string }, ... }
 */
function getErrorStatus(error: unknown): number | null {
	if (error && typeof error === 'object') {
		const apiError = error as { response?: { status?: number } };
		return apiError.response?.status ?? null;
	}
	return null;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff for transient errors
 */
async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	maxRetries: number = MAX_RETRIES,
	initialDelay: number = RETRY_DELAY_MS
): Promise<T> {
	let lastError: unknown;
	
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			
			// Only retry on retryable errors
			if (!isRetryableError(error) || attempt === maxRetries) {
				throw error;
			}
			
			// Exponential backoff: 1s, 2s, 4s
			const delay = initialDelay * Math.pow(2, attempt);
			if (import.meta.env.DEV) {
				console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms delay`);
			}
			await sleep(delay);
		}
	}
	
	throw lastError;
}

/**
 * Validate parameter value - allows primitives and arrays of primitives
 */
function isValidParameterValue(value: unknown): boolean {
	// Allow primitives
	if (value === null || value === undefined) return true;
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return true;
	}
	// Allow arrays of primitives (for reference_images, etc.)
	if (Array.isArray(value)) {
		return value.every(item => 
			item === null || 
			typeof item === 'string' || 
			typeof item === 'number' || 
			typeof item === 'boolean'
		);
	}
	return false;
}

/**
 * POST /api/replicate/predictions
 * Create a new prediction (video generation)
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { modelId, parameters } = body;

		// Validate request body structure
		if (!modelId || !parameters) {
			return json({ error: 'Missing modelId or parameters' }, { status: 400 });
		}

		// Validate modelId format
		if (typeof modelId !== 'string' || !modelId.includes('/')) {
			return json({ error: 'Invalid modelId format. Expected "owner/model"' }, { status: 400 });
		}

		// Validate parameters is an object
		if (typeof parameters !== 'object' || parameters === null || Array.isArray(parameters)) {
			return json({ error: 'Invalid parameters format. Expected an object' }, { status: 400 });
		}

		// Validate parameter values (allow primitives and arrays of primitives)
		for (const [key, value] of Object.entries(parameters)) {
			if (!isValidParameterValue(value)) {
				return json({ 
					error: `Invalid parameter type for ${key}. Only primitive values or arrays of primitives allowed` 
				}, { status: 400 });
			}
		}

		// Get configured Replicate client (handles API key validation)
		let replicate: Replicate;
		try {
			replicate = getReplicateClient();
		} catch (error) {
			return json(
				{ error: error instanceof Error ? error.message : 'Failed to initialize Replicate client' },
				{ status: 500 }
			);
		}

		// Parse model ID
		const [owner, modelName] = modelId.split('/');
		if (!owner || !modelName) {
			return json({ error: 'Invalid model ID format. Expected "owner/model"' }, { status: 400 });
		}

		// Get model version with retry logic
		const model = await retryWithBackoff(async () => {
			return await replicate.models.get(owner, modelName);
		});

		if (!model?.latest_version?.id) {
			return json({ error: `Model ${modelId} not found or has no versions` }, { status: 404 });
		}

		const version = model.latest_version.id;

		// Create prediction with retry logic for transient errors
		const prediction = await retryWithBackoff(async () => {
			return await replicate.predictions.create({
				version: version,
				input: parameters,
			});
		});

		// Map Replicate SDK response to our Prediction interface
		return json({
			id: prediction.id,
			status: prediction.status,
			input: prediction.input,
			output: prediction.output || null,
			error: prediction.error || null,
			logs: prediction.logs || null,
			metrics: prediction.metrics,
			created_at: prediction.created_at,
			started_at: prediction.started_at || null,
			completed_at: prediction.completed_at || null,
			version: prediction.version,
			urls: {
				get: prediction.urls?.get || '',
				cancel: prediction.urls?.cancel || '',
				stream: prediction.urls?.stream,
			},
		});
	} catch (error) {
		// Log error in development only (server-side)
		if (import.meta.env.DEV) {
			console.error('Error creating prediction:', error);
		}

		// Extract error details
		const statusCode = getErrorStatus(error);
		let errorMessage = 'Failed to create prediction';
		let httpStatus = 500;

		if (error instanceof Error) {
			errorMessage = error.message;
			
			// Provide user-friendly messages for common errors
			if (statusCode === 502) {
				errorMessage = 'Replicate API is temporarily unavailable (Bad Gateway). Please try again in a few moments.';
			} else if (statusCode === 503) {
				errorMessage = 'Replicate API is temporarily unavailable (Service Unavailable). Please try again in a few moments.';
			} else if (statusCode === 504) {
				errorMessage = 'Replicate API request timed out (Gateway Timeout). Please try again.';
			} else if (statusCode === 401) {
				errorMessage = 'Invalid API key. Please check your Replicate API key configuration.';
				httpStatus = 401;
			} else if (statusCode === 429) {
				errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
				httpStatus = 429;
			} else if (statusCode && statusCode >= 400 && statusCode < 500) {
				httpStatus = statusCode;
			}
		}
		
		return json(
			{ 
				error: errorMessage,
				...(statusCode && { statusCode })
			},
			{ status: httpStatus }
		);
	}
};

