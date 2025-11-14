/**
 * Generations Store
 *
 * Svelte store for managing video generation state.
 * Handles adding, updating, removing, and querying generations.
 */

import { writable, derived, get } from "svelte/store";
import type { Generation, GenerationsState, GenerationUpdate } from "../types/generation.js";
import { MAX_CONCURRENT_GENERATIONS } from "../utils/constants.js";

/**
 * Writable store for generations state
 */
const createGenerationsStore = () => {
	const { subscribe, set, update } = writable<GenerationsState>({
		items: [],
		activeCount: 0,
	});

	return {
		subscribe,
		set,
		update,
	};
};

export const generationsStore = createGenerationsStore();

/**
 * Calculate active count from generations
 */
function calculateActiveCount(items: Generation[]): number {
	return items.filter(
		(gen) => gen.status === "queued" || gen.status === "processing"
	).length;
}

/**
 * Add a new generation
 * @param generation - Generation to add
 */
export function addGeneration(generation: Generation): void {
	generationsStore.update((state) => {
		const newItems = [...state.items, generation];
		return {
			items: newItems,
			activeCount: calculateActiveCount(newItems),
		};
	});
}

/**
 * Update an existing generation
 * @param id - Generation ID
 * @param updates - Partial updates to apply
 */
export function updateGeneration(id: string, updates: GenerationUpdate): void {
	generationsStore.update((state) => {
		const newItems = state.items.map((gen) =>
			gen.id === id ? { ...gen, ...updates } : gen
		);
		return {
			items: newItems,
			activeCount: calculateActiveCount(newItems),
		};
	});
}

/**
 * Remove a generation
 * @param id - Generation ID to remove
 */
export function removeGeneration(id: string): void {
	generationsStore.update((state) => {
		const newItems = state.items.filter((gen) => gen.id !== id);
		return {
			items: newItems,
			activeCount: calculateActiveCount(newItems),
		};
	});
}

/**
 * Clear all completed generations
 */
export function clearCompleted(): void {
	generationsStore.update((state) => {
		const newItems = state.items.filter(
			(gen) => gen.status !== "completed" && gen.status !== "error" && gen.status !== "canceled"
		);
		return {
			items: newItems,
			activeCount: calculateActiveCount(newItems),
		};
	});
}

/**
 * Clear all generations
 */
export function clearAll(): void {
	generationsStore.set({
		items: [],
		activeCount: 0,
	});
}

/**
 * Derived store for active count
 */
export const activeCount = derived(generationsStore, ($store) => $store.activeCount);

