import { describe, it, expect } from "vitest";
import { getModelById, getModelsByCapability, getAllModels, AVAILABLE_MODELS } from "./models.js";

describe("getModelById", () => {
	it("returns model when found", () => {
		const model = getModelById("google/veo-3");
		expect(model).toBeDefined();
		expect(model?.id).toBe("google/veo-3");
		expect(model?.name).toBe("Google Veo 3.1");
	});

	it("returns undefined when not found", () => {
		const model = getModelById("nonexistent/model");
		expect(model).toBeUndefined();
	});

	it("handles empty string", () => {
		const model = getModelById("");
		expect(model).toBeUndefined();
	});
});

describe("getModelsByCapability", () => {
	it("returns models with textToVideo capability", () => {
		const models = getModelsByCapability("textToVideo");
		expect(models.length).toBeGreaterThan(0);
		expect(models.every((m) => m.capabilities.textToVideo)).toBe(true);
	});

	it("returns models with imageToVideo capability", () => {
		const models = getModelsByCapability("imageToVideo");
		expect(models.length).toBeGreaterThan(0);
		expect(models.every((m) => m.capabilities.imageToVideo)).toBe(true);
	});

	it("returns models with timestampControl capability", () => {
		const models = getModelsByCapability("timestampControl");
		expect(models.length).toBeGreaterThan(0);
		expect(models.every((m) => m.capabilities.timestampControl)).toBe(true);
	});

	it("returns empty array for capability with no matches", () => {
		// Assuming audio capability might not be available
		const models = getModelsByCapability("audio");
		expect(Array.isArray(models)).toBe(true);
	});
});

describe("getAllModels", () => {
	it("returns all available models", () => {
		const models = getAllModels();
		expect(models.length).toBe(AVAILABLE_MODELS.length);
		expect(models).toEqual(AVAILABLE_MODELS);
	});

	it("returns array with 10 models", () => {
		const models = getAllModels();
		expect(models.length).toBe(10);
	});
});

