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
		imageToVideo: true,
		audio: true,
		timestampControl: true,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt for video generation",
			default: "",
			required: true,
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
			],
		},
		{
			name: "duration",
			type: "select",
			description: "Video duration in seconds",
			default: 8,
			required: false,
			options: [
				{ value: 4, label: "4 seconds" },
				{ value: 6, label: "6 seconds" },
				{ value: 8, label: "8 seconds" },
			],
		},
		{
			name: "image",
			type: "string",
			description: "Input image to start generation (16:9 or 9:16, 1280x720 or 720x1280) - URI",
			default: null,
			required: false,
		},
		{
			name: "negative_prompt",
			type: "string",
			description: "Description of what to exclude from the video",
			default: null,
			required: false,
		},
		{
			name: "resolution",
			type: "select",
			description: "Resolution of the generated video",
			default: "1080p",
			required: false,
			options: [
				{ value: "720p", label: "720p" },
				{ value: "1080p", label: "1080p" },
			],
		},
		{
			name: "generate_audio",
			type: "boolean",
			description: "Generate audio with the video",
			default: true,
			required: false,
		},
		{
			name: "seed",
			type: "number",
			description: "Random seed for reproducible generation",
			default: null,
			required: false,
		},
	],
	pricing: {
		estimatedCost: 0.20, // Without audio, 0.40 with audio
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 120,
		maxDuration: 8,
		resolutions: ["720p", "1080p"],
		frameRates: [30],
	},
};

/**
 * Kling 2.5 Turbo Pro
 * Fast premium model with advanced features
 */
const kling25Pro: Model = {
	id: "kwaivgi/kling-v2.5-turbo-pro",
	name: "Kling 2.5 Turbo Pro",
	owner: "kwaivgi",
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
			description: "Text prompt for video generation (max 2500 chars)",
			default: "",
			required: true,
		},
		{
			name: "start_image",
			type: "string",
			description: "First frame of the video (replaces deprecated image) - URI",
			default: null,
			required: false,
		},
		{
			name: "duration",
			type: "select",
			description: "Duration of the video in seconds",
			default: 5,
			required: false,
			options: [
				{ value: 5, label: "5 seconds" },
				{ value: 10, label: "10 seconds" },
			],
		},
		{
			name: "aspect_ratio",
			type: "select",
			description: "Aspect ratio (ignored if start_image provided)",
			default: "16:9",
			required: false,
			options: [
				{ value: "16:9", label: "16:9" },
				{ value: "9:16", label: "9:16" },
				{ value: "1:1", label: "1:1" },
			],
		},
		{
			name: "negative_prompt",
			type: "string",
			description: "Things you do not want to see in the video",
			default: "",
			required: false,
		},
		{
			name: "cfg_scale",
			type: "number",
			description: "Classifier Free Guidance scale (prompt adherence), range 0-1",
			default: 0.5,
			required: false,
			min: 0,
			max: 1,
		},
	],
	pricing: {
		estimatedCost: 0.07,
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
		audio: true,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt for video generation",
			default: "",
			required: true,
		},
		{
			name: "negative_prompt",
			type: "string",
			description: "Negative prompt to avoid certain elements",
			default: "",
			required: false,
		},
		{
			name: "size",
			type: "select",
			description: "Video resolution and aspect ratio",
			default: "1280*720",
			required: false,
			options: [
				{ value: "832*480", label: "832x480" },
				{ value: "480*832", label: "480x832" },
				{ value: "1280*720", label: "1280x720" },
				{ value: "720*1280", label: "720x1280" },
				{ value: "1920*1080", label: "1920x1080" },
				{ value: "1080*1920", label: "1080x1920" },
			],
		},
		{
			name: "duration",
			type: "select",
			description: "Duration in seconds",
			default: 5,
			required: false,
			options: [
				{ value: 5, label: "5 seconds" },
				{ value: 10, label: "10 seconds" },
			],
		},
		{
			name: "audio",
			type: "string",
			description: "Audio file for voice/music synchronization (wav/mp3, 3-30s, ≤15MB) - URI",
			default: null,
			required: false,
		},
		{
			name: "seed",
			type: "number",
			description: "Random seed for reproducible generation",
			default: null,
			required: false,
		},
		{
			name: "enable_prompt_expansion",
			type: "boolean",
			description: "Enable prompt optimizer",
			default: true,
			required: false,
		},
	],
	pricing: {
		estimatedCost: 0.10,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 100,
		maxDuration: 10,
		resolutions: ["1080p"],
		frameRates: [30],
	},
};

/**
 * Hailuo 2
 * Fast and efficient video generation
 */
const hailuo23: Model = {
	id: "minimax/hailuo-02",
	name: "Hailuo 2",
	owner: "minimax",
	version: "latest",
	description: "Fast text-to-video generation with good quality",
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
			description: "Text prompt for generation",
			default: "",
			required: true,
		},
		{
			name: "duration",
			type: "select",
			description: "Duration in seconds (10s only for 768p)",
			default: 6,
			required: false,
			options: [
				{ value: 6, label: "6 seconds" },
				{ value: 10, label: "10 seconds" },
			],
		},
		{
			name: "resolution",
			type: "select",
			description: "Quality tier selection",
			default: "1080p",
			required: false,
			options: [
				{ value: "512p", label: "512p" },
				{ value: "768p", label: "768p" },
				{ value: "1080p", label: "1080p" },
			],
		},
		{
			name: "first_frame_image",
			type: "string",
			description: "First frame image (output matches aspect ratio) - URI",
			default: null,
			required: false,
		},
		{
			name: "last_frame_image",
			type: "string",
			description: "Last frame image for transitions - URI",
			default: null,
			required: false,
		},
		{
			name: "prompt_optimizer",
			type: "boolean",
			description: "Use prompt optimizer",
			default: true,
			required: false,
		},
	],
	pricing: {
		estimatedCost: 0.08,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 80,
		maxDuration: 10,
		resolutions: ["512p", "768p", "1080p"],
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
		audio: true,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text description for video generation",
			default: "",
			required: true,
		},
		{
			name: "quality",
			type: "select",
			description: "Output quality",
			default: "540p",
			required: false,
			options: [
				{ value: "360p", label: "360p" },
				{ value: "540p", label: "540p" },
				{ value: "720p", label: "720p" },
				{ value: "1080p", label: "1080p" },
			],
		},
		{
			name: "duration",
			type: "select",
			description: "Duration in seconds",
			default: 5,
			required: false,
			options: [
				{ value: 5, label: "5 seconds" },
				{ value: 8, label: "8 seconds" },
			],
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
		{
			name: "motion_mode",
			type: "select",
			description: "Motion quality (smooth only for 5s)",
			default: "normal",
			required: false,
			options: [
				{ value: "normal", label: "Normal" },
				{ value: "smooth", label: "Smooth" },
			],
		},
		{
			name: "style",
			type: "select",
			description: "Visual style preset",
			default: "None",
			required: false,
			options: [
				{ value: "None", label: "None" },
				{ value: "anime", label: "Anime" },
				{ value: "3d_animation", label: "3D Animation" },
				{ value: "clay", label: "Clay" },
				{ value: "cyberpunk", label: "Cyberpunk" },
				{ value: "comic", label: "Comic" },
			],
		},
		{
			name: "effect",
			type: "select",
			description: "Special effects (incompatible with last_frame_image)",
			default: "None",
			required: false,
			options: [
				{ value: "None", label: "None" },
				{ value: "Let's YMCA!", label: "Let's YMCA!" },
				{ value: "Subject 3 Fever", label: "Subject 3 Fever" },
				{ value: "Ghibli Live!", label: "Ghibli Live!" },
			],
		},
		{
			name: "negative_prompt",
			type: "string",
			description: "Elements to exclude",
			default: "",
			required: false,
		},
		{
			name: "seed",
			type: "number",
			description: "Random seed",
			default: null,
			required: false,
		},
		{
			name: "image",
			type: "string",
			description: "First frame image - URI",
			default: null,
			required: false,
		},
		{
			name: "last_frame_image",
			type: "string",
			description: "Last frame for transitions (requires image) - URI",
			default: null,
			required: false,
		},
		{
			name: "sound_effect_switch",
			type: "boolean",
			description: "Enable background music/sound effects",
			default: false,
			required: false,
		},
		{
			name: "sound_effect_content",
			type: "string",
			description: "Custom sound effect prompt",
			default: null,
			required: false,
		},
	],
	pricing: {
		estimatedCost: 0.09,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 70,
		maxDuration: 8,
		resolutions: ["360p", "540p", "720p", "1080p"],
		frameRates: [24, 30],
	},
};

/**
 * Seedance 1 Pro
 * Professional video generation model
 */
const seedance1Pro: Model = {
	id: "bytedance/seedance-1-pro",
	name: "Seedance 1 Pro",
	owner: "bytedance",
	version: "latest",
	description: "Professional-grade text-to-video with advanced features",
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
			description: "Text prompt for video generation",
			default: "",
			required: true,
		},
		{
			name: "image",
			type: "string",
			description: "Input image for image-to-video - URI",
			default: null,
			required: false,
		},
		{
			name: "last_frame_image",
			type: "string",
			description: "Last frame image (requires start frame) - URI",
			default: null,
			required: false,
		},
		{
			name: "duration",
			type: "number",
			description: "Video duration in seconds",
			default: 5,
			required: false,
			min: 2,
			max: 12,
		},
		{
			name: "resolution",
			type: "select",
			description: "Video resolution",
			default: "1080p",
			required: false,
			options: [
				{ value: "480p", label: "480p" },
				{ value: "720p", label: "720p" },
				{ value: "1080p", label: "1080p" },
			],
		},
		{
			name: "aspect_ratio",
			type: "select",
			description: "Aspect ratio (ignored if image used)",
			default: "16:9",
			required: false,
			options: [
				{ value: "16:9", label: "16:9" },
				{ value: "4:3", label: "4:3" },
				{ value: "1:1", label: "1:1" },
				{ value: "3:4", label: "3:4" },
				{ value: "9:16", label: "9:16" },
				{ value: "21:9", label: "21:9" },
				{ value: "9:21", label: "9:21" },
			],
		},
		{
			name: "camera_fixed",
			type: "boolean",
			description: "Fix camera position for stable shots",
			default: false,
			required: false,
		},
		{
			name: "fps",
			type: "number",
			description: "Frame rate (fixed at 24)",
			default: 24,
			required: false,
			min: 24,
			max: 24,
		},
		{
			name: "seed",
			type: "number",
			description: "Random seed",
			default: null,
			required: false,
		},
	],
	pricing: {
		estimatedCost: 0.15, // 1080p, varies by resolution
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 95,
		maxDuration: 12,
		resolutions: ["480p", "720p", "1080p"],
		frameRates: [24],
	},
};

/**
 * Wan 2.2 Fast
 * Speed-optimized version for quick iterations
 */
const wan22Fast: Model = {
	id: "wan-video/wan-2.2-t2v-fast",
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
			description: "Prompt for video generation",
			default: "",
			required: true,
		},
		{
			name: "num_frames",
			type: "number",
			description: "Number of frames (81 gives best results)",
			default: 81,
			required: false,
			min: 81,
			max: 121,
		},
		{
			name: "aspect_ratio",
			type: "select",
			description: "Aspect ratio (16:9=832x480, 9:16=480x832)",
			default: "16:9",
			required: false,
			options: [
				{ value: "16:9", label: "16:9" },
				{ value: "9:16", label: "9:16" },
			],
		},
		{
			name: "resolution",
			type: "select",
			description: "Video resolution",
			default: "480p",
			required: false,
			options: [
				{ value: "480p", label: "480p" },
				{ value: "720p", label: "720p" },
			],
		},
		{
			name: "frames_per_second",
			type: "number",
			description: "FPS (pricing based on 16fps)",
			default: 16,
			required: false,
			min: 5,
			max: 30,
		},
		{
			name: "go_fast",
			type: "boolean",
			description: "Speed optimization",
			default: true,
			required: false,
		},
		{
			name: "interpolate_output",
			type: "boolean",
			description: "Interpolate to 30 FPS using ffmpeg",
			default: true,
			required: false,
		},
		{
			name: "optimize_prompt",
			type: "boolean",
			description: "Translate prompt to Chinese",
			default: false,
			required: false,
		},
		{
			name: "sample_shift",
			type: "number",
			description: "Sample shift factor",
			default: 12,
			required: false,
			min: 1,
			max: 20,
		},
		{
			name: "seed",
			type: "number",
			description: "Random seed",
			default: null,
			required: false,
		},
		{
			name: "disable_safety_checker",
			type: "boolean",
			description: "Disable safety checker",
			default: false,
			required: false,
		},
	],
	pricing: {
		estimatedCost: 0.05,
		unit: "per second",
	},
	performance: {
		avgGenerationTime: 45,
		maxDuration: 6,
		resolutions: ["480p", "720p"],
		frameRates: [5, 16, 30],
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
		imageToVideo: true,
		audio: true,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt for video generation",
			default: "",
			required: true,
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
			],
		},
		{
			name: "duration",
			type: "select",
			description: "Video duration in seconds",
			default: 8,
			required: false,
			options: [
				{ value: 4, label: "4 seconds" },
				{ value: 6, label: "6 seconds" },
				{ value: 8, label: "8 seconds" },
			],
		},
		{
			name: "image",
			type: "string",
			description: "Input image (1280x720 or 720x1280 recommended) - URI",
			default: null,
			required: false,
		},
		{
			name: "negative_prompt",
			type: "string",
			description: "What to exclude from the video",
			default: null,
			required: false,
		},
		{
			name: "resolution",
			type: "select",
			description: "Video resolution",
			default: "1080p",
			required: false,
			options: [
				{ value: "720p", label: "720p" },
				{ value: "1080p", label: "1080p" },
			],
		},
		{
			name: "generate_audio",
			type: "boolean",
			description: "Generate audio with video",
			default: true,
			required: false,
		},
		{
			name: "seed",
			type: "number",
			description: "Random seed",
			default: null,
			required: false,
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
	id: "lightricks/ltx-video",
	name: "LTX-Video",
	owner: "lightricks",
	version: "latest",
	description: "Cost-effective text-to-video model for development and testing",
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
			description: "Text prompt (needs long descriptive prompts)",
			default: "best quality, 4k, HDR",
			required: true,
		},
		{
			name: "negative_prompt",
			type: "string",
			description: "Things to exclude",
			default: "low quality",
			required: false,
		},
		{
			name: "image",
			type: "string",
			description: "Optional starting frame - URI",
			default: null,
			required: false,
		},
		{
			name: "image_noise_scale",
			type: "number",
			description: "Lower = stick closer to input image",
			default: 0.15,
			required: false,
			min: 0,
			max: 1,
		},
		{
			name: "target_size",
			type: "number",
			description: "Output video size",
			default: 640,
			required: false,
			min: 512,
			max: 1024,
		},
		{
			name: "aspect_ratio",
			type: "select",
			description: "Video aspect ratio (13 options)",
			default: "3:2",
			required: false,
			options: [
				{ value: "1:1", label: "1:1" },
				{ value: "1:2", label: "1:2" },
				{ value: "2:1", label: "2:1" },
				{ value: "2:3", label: "2:3" },
				{ value: "3:2", label: "3:2" },
				{ value: "3:4", label: "3:4" },
				{ value: "4:3", label: "4:3" },
				{ value: "4:5", label: "4:5" },
				{ value: "5:4", label: "5:4" },
				{ value: "9:16", label: "9:16" },
				{ value: "16:9", label: "16:9" },
				{ value: "9:21", label: "9:21" },
				{ value: "21:9", label: "21:9" },
			],
		},
		{
			name: "cfg",
			type: "number",
			description: "How strongly video follows prompt",
			default: 3,
			required: false,
			min: 1,
			max: 20,
		},
		{
			name: "steps",
			type: "number",
			description: "Number of processing steps",
			default: 30,
			required: false,
			min: 1,
			max: 50,
		},
		{
			name: "length",
			type: "number",
			description: "Length in frames",
			default: 97,
			required: false,
			min: 97,
			max: 257,
		},
		{
			name: "model",
			type: "select",
			description: "Model version",
			default: "0.9.1",
			required: false,
			options: [
				{ value: "0.9.1", label: "0.9.1" },
				{ value: "0.9", label: "0.9" },
			],
		},
		{
			name: "seed",
			type: "number",
			description: "Seed for reproducibility",
			default: null,
			required: false,
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
		frameRates: [24, 25],
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
		imageToVideo: true,
		audio: false,
		timestampControl: false,
	},
	parameters: [
		{
			name: "prompt",
			type: "string",
			description: "Text prompt for generation",
			default: "",
			required: true,
		},
		{
			name: "first_frame_image",
			type: "string",
			description: "First frame (output matches aspect ratio) - URI",
			default: null,
			required: false,
		},
		{
			name: "subject_reference",
			type: "string",
			description: "Character reference image (uses S2V-01 model) - URI",
			default: null,
			required: false,
		},
		{
			name: "prompt_optimizer",
			type: "boolean",
			description: "Use prompt optimizer",
			default: true,
			required: false,
		},
	],
	pricing: {
		estimatedCost: 0.50, // Flat per video
		unit: "per video",
	},
	performance: {
		avgGenerationTime: 75,
		maxDuration: 6,
		resolutions: ["720p"],
		frameRates: [25],
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

