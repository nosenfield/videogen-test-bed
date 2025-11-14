/**
 * Models Store
 *
 * Svelte store for managing available video generation models.
 */

import { writable, derived, get } from "svelte/store";
import type { Model } from "../types/models.js";
import { AVAILABLE_MODELS } from "../services/models.js";

/**
 * Writable store for available models
 */
export const modelsStore = writable<Model[]>([]);

/**
 * Load all available models into the store
 */
export function loadModels(): void {
	modelsStore.set(AVAILABLE_MODELS);
}

/**
 * Derived store for filtered models
 * Currently returns all models, but can be extended with filtering logic
 */
export const filteredModels = derived(modelsStore, ($models) => $models);

