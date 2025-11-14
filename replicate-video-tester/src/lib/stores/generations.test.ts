import { describe, it, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import {
	generationsStore,
	addGeneration,
	updateGeneration,
	removeGeneration,
	clearCompleted,
	clearAll,
	activeCount,
} from "./generations.js";
import type { Generation } from "../types/generation.js";

describe("generationsStore", () => {
	beforeEach(() => {
		clearAll();
	});

	it("initializes with empty state", () => {
		const state = get(generationsStore);
		expect(state.items).toEqual([]);
		expect(state.activeCount).toBe(0);
	});
});

describe("addGeneration", () => {
	beforeEach(() => {
		clearAll();
	});

	it("adds a new generation", () => {
		const generation: Generation = {
			id: "gen-1",
			modelId: "google/veo-3",
			parameters: { prompt: "test" },
			status: "idle",
			videoUrl: null,
			error: null,
			startTime: null,
			endTime: null,
			cost: null,
			predictionId: null,
		};

		addGeneration(generation);

		const state = get(generationsStore);
		expect(state.items).toHaveLength(1);
		expect(state.items[0]).toEqual(generation);
	});
});

describe("updateGeneration", () => {
	beforeEach(() => {
		clearAll();
	});

	it("updates an existing generation", () => {
		const generation: Generation = {
			id: "gen-1",
			modelId: "google/veo-3",
			parameters: { prompt: "test" },
			status: "idle",
			videoUrl: null,
			error: null,
			startTime: null,
			endTime: null,
			cost: null,
			predictionId: null,
		};

		addGeneration(generation);
		updateGeneration("gen-1", { status: "queued", predictionId: "pred-123" });

		const state = get(generationsStore);
		expect(state.items[0].status).toBe("queued");
		expect(state.items[0].predictionId).toBe("pred-123");
	});

	it("does nothing if generation not found", () => {
		updateGeneration("nonexistent", { status: "queued" });

		const state = get(generationsStore);
		expect(state.items).toHaveLength(0);
	});
});

describe("removeGeneration", () => {
	beforeEach(() => {
		clearAll();
	});

	it("removes a generation", () => {
		const generation: Generation = {
			id: "gen-1",
			modelId: "google/veo-3",
			parameters: { prompt: "test" },
			status: "idle",
			videoUrl: null,
			error: null,
			startTime: null,
			endTime: null,
			cost: null,
			predictionId: null,
		};

		addGeneration(generation);
		removeGeneration("gen-1");

		const state = get(generationsStore);
		expect(state.items).toHaveLength(0);
	});
});

describe("clearCompleted", () => {
	beforeEach(() => {
		clearAll();
	});

	it("removes only completed generations", () => {
		const gen1: Generation = {
			id: "gen-1",
			modelId: "google/veo-3",
			parameters: { prompt: "test" },
			status: "completed",
			videoUrl: "https://example.com/video.mp4",
			error: null,
			startTime: 1000,
			endTime: 2000,
			cost: 0.5,
			predictionId: "pred-1",
		};

		const gen2: Generation = {
			id: "gen-2",
			modelId: "kling-ai/kling-2.5-turbo-pro",
			parameters: { prompt: "test2" },
			status: "processing",
			videoUrl: null,
			error: null,
			startTime: 2000,
			endTime: null,
			cost: null,
			predictionId: "pred-2",
		};

		addGeneration(gen1);
		addGeneration(gen2);
		clearCompleted();

		const state = get(generationsStore);
		expect(state.items).toHaveLength(1);
		expect(state.items[0].id).toBe("gen-2");
	});
});

describe("clearAll", () => {
	it("removes all generations", () => {
		const generation: Generation = {
			id: "gen-1",
			modelId: "google/veo-3",
			parameters: { prompt: "test" },
			status: "idle",
			videoUrl: null,
			error: null,
			startTime: null,
			endTime: null,
			cost: null,
			predictionId: null,
		};

		addGeneration(generation);
		clearAll();

		const state = get(generationsStore);
		expect(state.items).toHaveLength(0);
	});
});

describe("activeCount", () => {
	beforeEach(() => {
		clearAll();
	});

	it("counts active generations correctly", () => {
		const gen1: Generation = {
			id: "gen-1",
			modelId: "google/veo-3",
			parameters: { prompt: "test" },
			status: "queued",
			videoUrl: null,
			error: null,
			startTime: null,
			endTime: null,
			cost: null,
			predictionId: "pred-1",
		};

		const gen2: Generation = {
			id: "gen-2",
			modelId: "kling-ai/kling-2.5-turbo-pro",
			parameters: { prompt: "test2" },
			status: "processing",
			videoUrl: null,
			error: null,
			startTime: 1000,
			endTime: null,
			cost: null,
			predictionId: "pred-2",
		};

		const gen3: Generation = {
			id: "gen-3",
			modelId: "wan-video/wan-2.5-t2v",
			parameters: { prompt: "test3" },
			status: "completed",
			videoUrl: "https://example.com/video.mp4",
			error: null,
			startTime: 2000,
			endTime: 3000,
			cost: 0.5,
			predictionId: "pred-3",
		};

		addGeneration(gen1);
		addGeneration(gen2);
		addGeneration(gen3);

		const count = get(activeCount);
		expect(count).toBe(2); // gen1 (queued) + gen2 (processing)
	});
});

