/**
 * Replicate API Type Definitions
 *
 * TypeScript interfaces and types for interacting with the Replicate API.
 * Based on the official Replicate API documentation and JavaScript SDK.
 */

/**
 * Status of a prediction in the Replicate API
 */
export type PredictionStatus =
	| "starting"
	| "processing"
	| "succeeded"
	| "failed"
	| "canceled";

/**
 * Input parameters for a prediction
 */
export interface PredictionInput {
	[key: string]: string | number | boolean | string[] | null | undefined;
}

/**
 * Output from a successful prediction
 * For video generation, this typically contains a URL to the generated video
 */
export interface PredictionOutput {
	[key: string]: string | string[] | null | undefined;
}

/**
 * Replicate Prediction object
 * Represents a single prediction/job in the Replicate API
 */
export interface Prediction {
	/** Unique identifier for the prediction */
	id: string;

	/** Current status of the prediction */
	status: PredictionStatus;

	/** Input parameters passed to the model */
	input: PredictionInput;

	/** Output from the model (null until completed) */
	output: PredictionOutput | null;

	/** Error message if prediction failed */
	error: string | null;

	/** URLs for streaming logs */
	logs: string | null;

	/** Metrics about the prediction */
	metrics?: {
		/** Time to first token/output */
		predict_time?: number;
		/** Total time for prediction */
		total_time?: number;
	};

	/** When the prediction was created */
	created_at: string;

	/** When the prediction started processing */
	started_at: string | null;

	/** When the prediction completed (succeeded, failed, or canceled) */
	completed_at: string | null;

	/** Version of the model used */
	version: string;

	/** URL to fetch this prediction */
	urls: {
		get: string;
		cancel: string;
		stream?: string;
	};
}

/**
 * Model schema definition from Replicate API
 * Describes the input/output structure of a model
 */
export interface ModelSchema {
	/** Input schema (JSON Schema format) */
	input: {
		type: "object";
		properties: Record<string, SchemaProperty>;
		required?: string[];
	};

	/** Output schema (JSON Schema format) */
	output?: {
		type: string;
		items?: SchemaProperty;
		properties?: Record<string, SchemaProperty>;
	};
}

/**
 * JSON Schema property definition
 */
export interface SchemaProperty {
	type: "string" | "number" | "integer" | "boolean" | "array" | "object";
	description?: string;
	default?: unknown;
	minimum?: number;
	maximum?: number;
	enum?: unknown[];
	items?: SchemaProperty;
	properties?: Record<string, SchemaProperty>;
	required?: string[];
}

