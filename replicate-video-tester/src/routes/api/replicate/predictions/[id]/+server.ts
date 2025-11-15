import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getReplicateClient } from '$lib/server/replicate-auth.js';
import type Replicate from 'replicate';

/**
 * GET /api/replicate/predictions/[id]
 * Get prediction status
 */
export const GET: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;

		// Validate prediction ID
		if (!id || typeof id !== 'string' || id.trim() === '') {
			return json({ error: 'Missing or invalid prediction ID' }, { status: 400 });
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

		const prediction = await replicate.predictions.get(id);

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
			console.error('Error getting prediction:', error);
		}
		return json(
			{
				error: error instanceof Error ? error.message : 'Failed to get prediction',
			},
			{ status: 500 }
		);
	}
};

