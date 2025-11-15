import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getReplicateClient } from '$lib/server/replicate-auth.js';
import type Replicate from 'replicate';

/**
 * POST /api/replicate/predictions/[id]/cancel
 * Cancel a prediction
 */
export const POST: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;

		if (!id) {
			return json({ error: 'Missing prediction ID' }, { status: 400 });
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

		await replicate.predictions.cancel(id);

		return json({ success: true });
	} catch (error) {
		console.error('Error canceling prediction:', error);
		return json(
			{
				error: error instanceof Error ? error.message : 'Failed to cancel prediction',
			},
			{ status: 500 }
		);
	}
};

