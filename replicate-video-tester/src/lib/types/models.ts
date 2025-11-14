/**
 * Model Configuration Type Definitions
 *
 * TypeScript interfaces for model metadata, configuration, and capabilities.
 * Used throughout the application for model selection and parameter management.
 */

import type { ModelSchema } from "./replicate.js";

/**
 * Model parameter definition
 * Describes a single parameter that can be configured for a model
 */
export interface ModelParameter {
	/** Parameter name (matches Replicate API parameter name) */
	name: string;

	/** Parameter type */
	type: "string" | "number" | "boolean" | "select";

	/** Human-readable description */
	description: string;

	/** Default value if not provided */
	default: string | number | boolean | null;

	/** Whether this parameter is required */
	required: boolean;

	/** Minimum value (for number types) */
	min?: number;

	/** Maximum value (for number types) */
	max?: number;

	/** Available options (for select types) */
	options?: Array<{ value: string | number; label: string }>;
}

/**
 * Model capabilities
 * Describes what features a model supports
 */
export interface ModelCapabilities {
	/** Can generate video from text prompts */
	textToVideo: boolean;

	/** Can generate video from image inputs */
	imageToVideo: boolean;

	/** Supports audio input/output */
	audio: boolean;

	/** Supports timestamp-based control */
	timestampControl: boolean;
}

/**
 * Model pricing information
 */
export interface ModelPricing {
	/** Estimated cost per generation (in USD) */
	estimatedCost: number;

	/** Unit of pricing (e.g., "per second", "per generation") */
	unit: string;
}

/**
 * Model performance characteristics
 */
export interface ModelPerformance {
	/** Average generation time in seconds */
	avgGenerationTime: number;

	/** Maximum video duration in seconds */
	maxDuration: number;

	/** Supported video resolutions */
	resolutions: string[];

	/** Supported frame rates */
	frameRates: number[];
}

/**
 * Complete model configuration
 * Represents a video generation model available in the application
 */
export interface Model {
	/** Unique model identifier (e.g., "google/veo-3") */
	id: string;

	/** Human-readable model name */
	name: string;

	/** Model owner/creator (e.g., "google") */
	owner: string;

	/** Model version (e.g., "abc123") */
	version: string;

	/** Model description */
	description: string;

	/** Model capabilities */
	capabilities: ModelCapabilities;

	/** Available parameters for this model */
	parameters: ModelParameter[];

	/** Pricing information */
	pricing: ModelPricing;

	/** Performance characteristics */
	performance: ModelPerformance;

	/** Replicate API model schema (optional, for validation) */
	schema?: ModelSchema;
}

