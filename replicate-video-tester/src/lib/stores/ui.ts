/**
 * UI State Store
 *
 * Svelte store for managing global UI state.
 * Handles loading states, errors, and session cost tracking.
 */

import { writable } from "svelte/store";
import { MAX_CONCURRENT_GENERATIONS } from "../utils/constants.js";

/**
 * UI State interface
 */
export interface UIState {
	/** Whether the application is in a loading state */
	isLoading: boolean;

	/** Global error message (null if no error) */
	globalError: string | null;

	/** Cumulative cost of all generations in this session (USD) */
	sessionCost: number;

	/** Maximum number of concurrent generations */
	maxConcurrentGenerations: number;
}

/**
 * Writable store for UI state
 */
export const uiStore = writable<UIState>({
	isLoading: false,
	globalError: null,
	sessionCost: 0,
	maxConcurrentGenerations: MAX_CONCURRENT_GENERATIONS,
});

/**
 * Set loading state
 * @param loading - Whether the app is loading
 */
export function setLoading(loading: boolean): void {
	uiStore.update((state) => ({
		...state,
		isLoading: loading,
	}));
}

/**
 * Set global error message
 * @param error - Error message (null to clear)
 */
export function setError(error: string | null): void {
	uiStore.update((state) => ({
		...state,
		globalError: error,
	}));
}

/**
 * Clear global error
 */
export function clearError(): void {
	uiStore.update((state) => ({
		...state,
		globalError: null,
	}));
}

/**
 * Update session cost (adds to existing cost)
 * @param cost - Cost to add (in USD)
 */
export function updateSessionCost(cost: number): void {
	uiStore.update((state) => ({
		...state,
		sessionCost: state.sessionCost + cost,
	}));
}

