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

describe("Immutability", () => {
	beforeEach(() => {
		modelsStore.set([]);
	});

	it("loadModels does not mutate original state", () => {
		const initialState = get(modelsStore);
		const initialModels = [...initialState];

		loadModels();

		// Original state should not be mutated
		expect(initialState).toEqual([]);
		expect(initialModels).toEqual([]);

		// New state should have models
		const newState = get(modelsStore);
		expect(newState.length).toBeGreaterThan(0);
	});
});

