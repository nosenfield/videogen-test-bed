/**
 * Generation State Type Definitions
 *
 * TypeScript interfaces for video generation lifecycle state.
 * Used by the generations store and components to track generation progress.
 */

/**
 * Status of a video generation
 */
export type GenerationStatus =
	| "idle"
	| "queued"
	| "processing"
	| "completed"
	| "error"
	| "canceled";

/**
 * Single video generation instance
 * Tracks the lifecycle of one video generation request
 */
export interface Generation {
	/** Unique identifier for this generation (local) */
	id: string;

	/** Model ID used for this generation */
	modelId: string;

	/** Parameters passed to the model */
	parameters: Record<string, string | number | boolean>;

	/** Current status */
	status: GenerationStatus;

	/** URL to the generated video (null until completed) */
	videoUrl: string | null;

	/** Error message if generation failed */
	error: string | null;

	/** Timestamp when generation started (milliseconds) */
	startTime: number | null;

	/** Timestamp when generation completed (milliseconds) */
	endTime: number | null;

	/** Cost of this generation in USD (null until completed) */
	cost: number | null;

	/** Replicate prediction ID (null until queued) */
	predictionId: string | null;
}

/**
 * State of all generations in the application
 * Used by the generations store
 */
export interface GenerationsState {
	/** Array of all generations */
	items: Generation[];

	/** Count of active generations (queued or processing) */
	activeCount: number;
}

/**
 * Partial update for a generation
 * Used when updating generation state
 */
export type GenerationUpdate = Partial<Omit<Generation, "id" | "modelId">>;

/**
 * Summary of a generation (subset of properties)
 * Used for display in lists
 */
export type GenerationSummary = Pick<
	Generation,
	"id" | "modelId" | "status" | "videoUrl" | "error" | "cost"
>;

