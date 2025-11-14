import { describe, it, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import { modelsStore, loadModels, filteredModels } from "./models.js";
import { AVAILABLE_MODELS } from "../services/models.js";

describe("modelsStore", () => {
	beforeEach(() => {
		modelsStore.set([]);
	});

	it("initializes with empty array", () => {
		const models = get(modelsStore);
		expect(models).toEqual([]);
	});
});

describe("loadModels", () => {
	beforeEach(() => {
		modelsStore.set([]);
	});

	it("loads all available models", () => {
		loadModels();

		const models = get(modelsStore);
		expect(models).toHaveLength(AVAILABLE_MODELS.length);
		expect(models).toEqual(AVAILABLE_MODELS);
	});
});

describe("filteredModels", () => {
	beforeEach(() => {
		modelsStore.set([]);
		loadModels();
	});

	it("returns all models when no filter applied", () => {
		const models = get(filteredModels);
		expect(models).toHaveLength(AVAILABLE_MODELS.length);
	});

	it("returns all models through filteredModels", () => {
		const models = get(filteredModels);
		expect(models).toHaveLength(AVAILABLE_MODELS.length);
		expect(models).toEqual(AVAILABLE_MODELS);
	});
});

