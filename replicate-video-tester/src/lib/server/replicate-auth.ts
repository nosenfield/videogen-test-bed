/**
 * Server-side Replicate API authentication utility
 * 
 * Provides secure API key access and client initialization for server-side routes.
 * Do NOT use VITE_ prefixed variables here - they expose secrets to the client bundle.
 */

import { env } from "$env/dynamic/private";
import Replicate from "replicate";

/**
 * Get a configured Replicate client instance
 * @returns Configured Replicate client
 * @throws {Error} If API key is not configured
 */
export function getReplicateClient(): Replicate {
	const apiKey = env.REPLICATE_API_KEY;

	if (!apiKey || apiKey.trim() === "" || apiKey.includes("your_replicate_api_key") || apiKey.includes("your_api_key")) {
		throw new Error(
			"Replicate API key not configured. Please set REPLICATE_API_KEY in your .env file with your actual API key from https://replicate.com/account/api-tokens"
		);
	}

	return new Replicate({
		auth: apiKey,
	});
}

