import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getReplicateClient } from '$lib/server/replicate-auth.js';
import type Replicate from 'replicate';

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

		// Validate parameter values are primitives only (security: prevent object injection)
		for (const [key, value] of Object.entries(parameters)) {
			if (typeof value === 'object' && value !== null) {
				return json({ error: `Invalid parameter type for ${key}. Only primitive values allowed` }, { status: 400 });
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

		// Use replicate.run() which accepts model identifiers like "owner/model"
		// This will automatically use the latest version
		// We need to create a prediction manually to get the prediction object for polling
		// First, get the latest version of the model
		const [owner, modelName] = modelId.split('/');
		if (!owner || !modelName) {
			return json({ error: 'Invalid model ID format. Expected "owner/model"' }, { status: 400 });
		}

		const model = await replicate.models.get(owner, modelName);
		if (!model?.latest_version?.id) {
			return json({ error: `Model ${modelId} not found or has no versions` }, { status: 404 });
		}

		const version = model.latest_version.id;

		// Now create the prediction with the version hash
		const prediction = await replicate.predictions.create({
			version: version,
			input: parameters,
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
		const errorMessage = error instanceof Error 
			? error.message 
			: 'Failed to create prediction';
		
		return json(
			{ error: errorMessage },
			{ status: 500 }
		);
	}
};

