import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import Replicate from 'replicate';

/**
 * POST /api/replicate/predictions
 * Create a new prediction (video generation)
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { modelId, parameters } = await request.json();

		if (!modelId || !parameters) {
			return json({ error: 'Missing modelId or parameters' }, { status: 400 });
		}

		// Get API key from environment (server-side)
		// Use $env/dynamic/private to access all env vars on server
		const apiKey = env.VITE_REPLICATE_API_KEY || 
		               env.REPLICATE_API_KEY;

		if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_replicate_api_key') || apiKey.includes('your_api_key')) {
			return json(
				{ error: 'Replicate API key not configured. Please set VITE_REPLICATE_API_KEY in your .env file with your actual API key from https://replicate.com/account/api-tokens' },
				{ status: 500 }
			);
		}

		const replicate = new Replicate({
			auth: apiKey,
		});

		// Use replicate.run() which accepts model identifiers like "owner/model"
		// This will automatically use the latest version
		// We need to create a prediction manually to get the prediction object for polling
		// First, get the latest version of the model
		const [owner, modelName] = modelId.split('/');
		if (!owner || !modelName) {
			return json({ error: 'Invalid model ID format. Expected "owner/model"' }, { status: 400 });
		}

		const model = await replicate.models.get(owner, modelName);
		if (!model || !model.latest_version) {
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
		console.error('Error creating prediction:', error);
		const errorMessage = error instanceof Error 
			? error.message 
			: 'Failed to create prediction';
		
		return json(
			{ error: errorMessage },
			{ status: 500 }
		);
	}
};

