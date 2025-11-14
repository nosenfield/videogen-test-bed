/**
 * Model Definitions
 *
 * Configuration for top 10 video generation models available in Replicate.
 * Each model includes metadata, parameters, pricing, and performance characteristics.
 */

import type { Model } from "../types/models.js";

/**
 * Google Veo 3.1
 * Premium text-to-video model with high quality output
 */
const veo31: Model = {
	id: "google/veo-3",
	name: "Google Veo 3.1",
	owner: "google",
	version: "latest",
	description: "High-quality text-to-video generation with advanced temporal coherence",
	capabilities: {
		textToVideo: true,
		imageToVideo: false,
		audio: false,
		timestampControl: true,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt describing the video to generate",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 5,
			required: false,
			min: 1,
			max: 60,
		},
		{
			name: "aspect_ratio",
			type: "select",
			description: "Video aspect ratio",
			default: "16:9",
			required: false,
			options: [
				{ value: "16:9", label: "16:9 (Landscape)" },
				{ value: "9:16", label: "9:16 (Portrait)" },
				{ value: "1:1", label: "1:1 (Square)" },
			],
		},
	],
	pricing: {
		estimatedCost: 0.15,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 120,
		maxDuration: 60,
		resolutions: ["1080p"],
		frameRates: [30],
	},
};

/**
 * Kling 2.5 Turbo Pro
 * Fast premium model with advanced features
 */
const kling25Pro: Model = {
	id: "kling-ai/kling-2.5-turbo-pro",
	name: "Kling 2.5 Turbo Pro",
	owner: "kling-ai",
	version: "latest",
	description: "Fast premium text-to-video with high fidelity and smooth motion",
	capabilities: {
		textToVideo: true,
		imageToVideo: true,
		audio: false,
		timestampControl: true,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt describing the video",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 5,
			required: false,
			min: 1,
			max: 10,
		},
		{
			name: "aspect_ratio",
			type: "select",
			description: "Video aspect ratio",
			default: "16:9",
			required: false,
			options: [
				{ value: "16:9", label: "16:9" },
				{ value: "9:16", label: "9:16" },
				{ value: "1:1", label: "1:1" },
			],
		},
	],
	pricing: {
		estimatedCost: 0.12,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 90,
		maxDuration: 10,
		resolutions: ["1080p"],
		frameRates: [24, 30],
	},
};

/**
 * Wan 2.5 T2V
 * High-quality text-to-video model
 */
const wan25T2V: Model = {
	id: "wan-video/wan-2.5-t2v",
	name: "Wan 2.5 T2V",
	owner: "wan-video",
	version: "latest",
	description: "High-quality text-to-video generation with excellent detail",
	capabilities: {
		textToVideo: true,
		imageToVideo: false,
		audio: false,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 5,
			required: false,
			min: 1,
			max: 8,
		},
	],
	pricing: {
		estimatedCost: 0.10,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 100,
		maxDuration: 8,
		resolutions: ["1080p"],
		frameRates: [30],
	},
};

/**
 * Hailuo 2.3
 * Fast and efficient video generation
 */
const hailuo23: Model = {
	id: "hailuo-ai/hailuo-2.3",
	name: "Hailuo 2.3",
	owner: "hailuo-ai",
	version: "latest",
	description: "Fast text-to-video generation with good quality",
	capabilities: {
		textToVideo: true,
		imageToVideo: false,
		audio: false,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 5,
			required: false,
			min: 1,
			max: 10,
		},
	],
	pricing: {
		estimatedCost: 0.08,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 80,
		maxDuration: 10,
		resolutions: ["720p", "1080p"],
		frameRates: [24, 30],
	},
};

/**
 * PixVerse v4
 * Versatile video generation model
 */
const pixverseV4: Model = {
	id: "pixverse/pixverse-v4",
	name: "PixVerse v4",
	owner: "pixverse",
	version: "latest",
	description: "Versatile text-to-video model with good motion control",
	capabilities: {
		textToVideo: true,
		imageToVideo: true,
		audio: false,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 4,
			required: false,
			min: 1,
			max: 6,
		},
	],
	pricing: {
		estimatedCost: 0.09,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 70,
		maxDuration: 6,
		resolutions: ["720p", "1080p"],
		frameRates: [24, 30],
	},
};

/**
 * Seedance 1 Pro
 * Professional video generation model
 */
const seedance1Pro: Model = {
	id: "seedance/seedance-1-pro",
	name: "Seedance 1 Pro",
	owner: "seedance",
	version: "latest",
	description: "Professional-grade text-to-video with advanced features",
	capabilities: {
		textToVideo: true,
		imageToVideo: false,
		audio: false,
		timestampControl: true,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 5,
			required: false,
			min: 1,
			max: 10,
		},
	],
	pricing: {
		estimatedCost: 0.11,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 95,
		maxDuration: 10,
		resolutions: ["1080p"],
		frameRates: [30],
	},
};

/**
 * Wan 2.2 Fast
 * Speed-optimized version for quick iterations
 */
const wan22Fast: Model = {
	id: "wan-video/wan-2.2-fast",
	name: "Wan 2.2 Fast",
	owner: "wan-video",
	version: "latest",
	description: "Speed-optimized text-to-video for fast iterations",
	capabilities: {
		textToVideo: true,
		imageToVideo: false,
		audio: false,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 4,
			required: false,
			min: 1,
			max: 6,
		},
	],
	pricing: {
		estimatedCost: 0.05,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 45,
		maxDuration: 6,
		resolutions: ["720p", "1080p"],
		frameRates: [24, 30],
	},
};

/**
 * Veo 3 Fast
 * Fast version of Veo 3 for quick testing
 */
const veo3Fast: Model = {
	id: "google/veo-3-fast",
	name: "Veo 3 Fast",
	owner: "google",
	version: "latest",
	description: "Fast version of Veo 3 for quick iterations",
	capabilities: {
		textToVideo: true,
		imageToVideo: false,
		audio: false,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 4,
			required: false,
			min: 1,
			max: 8,
		},
	],
	pricing: {
		estimatedCost: 0.07,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 60,
		maxDuration: 8,
		resolutions: ["720p", "1080p"],
		frameRates: [24, 30],
	},
};

/**
 * LTX-Video
 * Cost-effective model for development
 */
const ltxVideo: Model = {
	id: "ltx-video/ltx-video",
	name: "LTX-Video",
	owner: "ltx-video",
	version: "latest",
	description: "Cost-effective text-to-video model for development and testing",
	capabilities: {
		textToVideo: true,
		imageToVideo: false,
		audio: false,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 3,
			required: false,
			min: 1,
			max: 5,
		},
	],
	pricing: {
		estimatedCost: 0.03,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 40,
		maxDuration: 5,
		resolutions: ["720p"],
		frameRates: [24],
	},
};

/**
 * Minimax video-01
 * Balanced model with good quality and speed
 */
const minimaxVideo01: Model = {
	id: "minimax/video-01",
	name: "Minimax video-01",
	owner: "minimax",
	version: "latest",
	description: "Balanced text-to-video model with good quality and reasonable speed",
	capabilities: {
		textToVideo: true,
		imageToVideo: false,
		audio: false,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 5,
			required: false,
			min: 1,
			max: 10,
		},
	],
	pricing: {
		estimatedCost: 0.06,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 75,
		maxDuration: 10,
		resolutions: ["720p", "1080p"],
		frameRates: [24, 30],
	},
};

/**
 * All available models
 */
export const AVAILABLE_MODELS: Model[] = [
	veo31,
	kling25Pro,
	wan25T2V,
	hailuo23,
	pixverseV4,
	seedance1Pro,
	wan22Fast,
	veo3Fast,
	ltxVideo,
	minimaxVideo01,
];

/**
 * Get a model by its ID
 * @param id - Model ID (e.g., "google/veo-3")
 * @returns Model if found, undefined otherwise
 */
export function getModelById(id: string): Model | undefined {
	return AVAILABLE_MODELS.find((model) => model.id === id);
}

/**
 * Get all models that support a specific capability
 * @param capability - Capability to filter by
 * @returns Array of models with the specified capability
 */
export function getModelsByCapability(
	capability: keyof Model["capabilities"]
): Model[] {
	return AVAILABLE_MODELS.filter((model) => model.capabilities[capability]);
}

/**
 * Get all available models
 * @returns Array of all models
 */
export function getAllModels(): Model[] {
	return AVAILABLE_MODELS;
}

