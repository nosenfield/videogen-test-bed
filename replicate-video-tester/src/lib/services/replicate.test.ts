import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initializeReplicate, getReplicateClient, resetClient } from "./replicate.js";

describe("initializeReplicate", () => {
	beforeEach(() => {
		// Reset client state between tests
		resetClient();
	});

	it("initializes client with API key from environment", () => {
		const apiKey = "test-api-key-123";
		vi.stubEnv("VITE_REPLICATE_API_KEY", apiKey);

		expect(() => initializeReplicate()).not.toThrow();
		const client = getReplicateClient();
		expect(client).toBeDefined();
	});

	it("throws error if API key is missing", () => {
		vi.stubEnv("VITE_REPLICATE_API_KEY", "");

		expect(() => initializeReplicate()).toThrow("Replicate API key is required");
	});

	it("creates singleton client instance", () => {
		const apiKey = "test-api-key-456";
		vi.stubEnv("VITE_REPLICATE_API_KEY", apiKey);

		initializeReplicate();
		const client1 = getReplicateClient();
		const client2 = getReplicateClient();

		expect(client1).toBe(client2);
	});
});

describe("getReplicateClient", () => {
	it("throws error if client not initialized", () => {
		resetClient();
		expect(() => getReplicateClient()).toThrow("Replicate client not initialized");
	});
});

describe("generateVideo", () => {
	beforeEach(() => {
		resetClient();
		const apiKey = "test-api-key";
		vi.stubEnv("VITE_REPLICATE_API_KEY", apiKey);
		initializeReplicate();
	});

	it("successfully starts video generation", async () => {
		const { generateVideo } = await import("./replicate.js");
		const replicate = getReplicateClient();

		// Mock the predictions.create method
		const mockPrediction = {
			id: "pred-123",
			status: "starting" as const,
			input: { prompt: "test" },
			output: null,
			error: null,
			logs: null,
			created_at: new Date().toISOString(),
			started_at: null,
			completed_at: null,
			version: "abc123",
			urls: { get: "https://api.replicate.com/v1/predictions/pred-123", cancel: "https://api.replicate.com/v1/predictions/pred-123/cancel" },
		};

		vi.spyOn(replicate.predictions, "create").mockResolvedValue(mockPrediction as any);

		const result = await generateVideo("google/veo-3", { prompt: "test video" });

		expect(result).toEqual(mockPrediction);
		expect(replicate.predictions.create).toHaveBeenCalledWith({
			model: "google/veo-3",
			input: { prompt: "test video" },
		});
	});

	it("handles API errors gracefully", async () => {
		const { generateVideo } = await import("./replicate.js");
		const replicate = getReplicateClient();

		vi.spyOn(replicate.predictions, "create").mockRejectedValue(new Error("API Error"));

		await expect(generateVideo("google/veo-3", { prompt: "test" })).rejects.toThrow("API Error");
	});
});

describe("pollGenerationStatus", () => {
	beforeEach(() => {
		resetClient();
		const apiKey = "test-api-key";
		vi.stubEnv("VITE_REPLICATE_API_KEY", apiKey);
		initializeReplicate();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("polls until completion", async () => {
		const { pollGenerationStatus } = await import("./replicate.js");
		const replicate = getReplicateClient();

		const onUpdate = vi.fn();
		const mockPredictions = [
			{ id: "pred-123", status: "starting", input: {}, output: null, error: null, logs: null, created_at: "", started_at: null, completed_at: null, version: "", urls: { get: "", cancel: "" } },
			{ id: "pred-123", status: "processing", input: {}, output: null, error: null, logs: null, created_at: "", started_at: "", completed_at: null, version: "", urls: { get: "", cancel: "" } },
			{ id: "pred-123", status: "succeeded", input: {}, output: { video: "https://example.com/video.mp4" }, error: null, logs: null, created_at: "", started_at: "", completed_at: "", version: "", urls: { get: "", cancel: "" } },
		];

		let callCount = 0;
		vi.spyOn(replicate.predictions, "get").mockImplementation(() => {
			return Promise.resolve(mockPredictions[callCount++] as any);
		});

		const pollPromise = pollGenerationStatus("pred-123", onUpdate);

		// Fast-forward through polling
		await vi.advanceTimersByTimeAsync(2000); // Initial delay
		await vi.advanceTimersByTimeAsync(3000); // First poll
		await vi.advanceTimersByTimeAsync(3000); // Second poll

		const result = await pollPromise;

		expect(result.status).toBe("succeeded");
		expect(onUpdate).toHaveBeenCalledTimes(3);
	});

	it("stops polling on error status", async () => {
		const { pollGenerationStatus } = await import("./replicate.js");
		const replicate = getReplicateClient();

		const onUpdate = vi.fn();
		const mockPrediction = {
			id: "pred-123",
			status: "failed",
			input: {},
			output: null,
			error: "Generation failed",
			logs: null,
			created_at: "",
			started_at: "",
			completed_at: "",
			version: "",
			urls: { get: "", cancel: "" },
		};

		vi.spyOn(replicate.predictions, "get").mockResolvedValue(mockPrediction as any);

		const pollPromise = pollGenerationStatus("pred-123", onUpdate);
		await vi.advanceTimersByTimeAsync(2000);

		const result = await pollPromise;

		expect(result.status).toBe("failed");
		expect(result.error).toBe("Generation failed");
	});
});

describe("cancelGeneration", () => {
	beforeEach(() => {
		resetClient();
		const apiKey = "test-api-key";
		vi.stubEnv("VITE_REPLICATE_API_KEY", apiKey);
		initializeReplicate();
	});

	it("successfully cancels a generation", async () => {
		const { cancelGeneration } = await import("./replicate.js");
		const replicate = getReplicateClient();

		vi.spyOn(replicate.predictions, "cancel").mockResolvedValue(undefined as any);

		await expect(cancelGeneration("pred-123")).resolves.not.toThrow();
		expect(replicate.predictions.cancel).toHaveBeenCalledWith("pred-123");
	});

	it("handles cancellation errors gracefully", async () => {
		const { cancelGeneration } = await import("./replicate.js");
		const replicate = getReplicateClient();

		vi.spyOn(replicate.predictions, "cancel").mockRejectedValue(new Error("Cancel failed"));

		await expect(cancelGeneration("pred-123")).rejects.toThrow("Cancel failed");
	});

	it("is safe to call on completed generations", async () => {
		const { cancelGeneration } = await import("./replicate.js");
		const replicate = getReplicateClient();

		// Simulate API returning success even for completed predictions
		vi.spyOn(replicate.predictions, "cancel").mockResolvedValue(undefined as any);

		await expect(cancelGeneration("pred-completed")).resolves.not.toThrow();
	});
});

