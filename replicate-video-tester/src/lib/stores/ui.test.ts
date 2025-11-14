import { describe, it, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import {
	uiStore,
	setLoading,
	setError,
	clearError,
	updateSessionCost,
} from "./ui.js";
import { MAX_CONCURRENT_GENERATIONS } from "../utils/constants.js";

describe("uiStore", () => {
	beforeEach(() => {
		uiStore.set({
			isLoading: false,
			globalError: null,
			sessionCost: 0,
			maxConcurrentGenerations: MAX_CONCURRENT_GENERATIONS,
		});
	});

	it("initializes with default values", () => {
		const state = get(uiStore);
		expect(state.isLoading).toBe(false);
		expect(state.globalError).toBeNull();
		expect(state.sessionCost).toBe(0);
		expect(state.maxConcurrentGenerations).toBe(MAX_CONCURRENT_GENERATIONS);
	});
});

describe("setLoading", () => {
	beforeEach(() => {
		uiStore.set({
			isLoading: false,
			globalError: null,
			sessionCost: 0,
			maxConcurrentGenerations: MAX_CONCURRENT_GENERATIONS,
		});
	});

	it("sets loading state to true", () => {
		setLoading(true);
		const state = get(uiStore);
		expect(state.isLoading).toBe(true);
	});

	it("sets loading state to false", () => {
		setLoading(true);
		setLoading(false);
		const state = get(uiStore);
		expect(state.isLoading).toBe(false);
	});
});

describe("setError", () => {
	beforeEach(() => {
		uiStore.set({
			isLoading: false,
			globalError: null,
			sessionCost: 0,
			maxConcurrentGenerations: MAX_CONCURRENT_GENERATIONS,
		});
	});

	it("sets error message", () => {
		setError("Test error");
		const state = get(uiStore);
		expect(state.globalError).toBe("Test error");
	});
});

describe("clearError", () => {
	beforeEach(() => {
		uiStore.set({
			isLoading: false,
			globalError: "Existing error",
			sessionCost: 0,
			maxConcurrentGenerations: MAX_CONCURRENT_GENERATIONS,
		});
	});

	it("clears error message", () => {
		clearError();
		const state = get(uiStore);
		expect(state.globalError).toBeNull();
	});
});

describe("updateSessionCost", () => {
	beforeEach(() => {
		uiStore.set({
			isLoading: false,
			globalError: null,
			sessionCost: 0,
			maxConcurrentGenerations: MAX_CONCURRENT_GENERATIONS,
		});
	});

	it("adds to session cost", () => {
		updateSessionCost(0.5);
		const state = get(uiStore);
		expect(state.sessionCost).toBe(0.5);

		updateSessionCost(0.3);
		const updatedState = get(uiStore);
		expect(updatedState.sessionCost).toBe(0.8);
	});
});

