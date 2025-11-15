import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce, memoize } from "./performance.js";

describe("debounce", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("delays function execution", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn();
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("cancels previous calls when called multiple times", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn();
		debouncedFn();
		debouncedFn();

		vi.advanceTimersByTime(50);
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(50);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("passes arguments correctly", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn("arg1", "arg2");
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledWith("arg1", "arg2");
	});

	it("handles multiple separate calls", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn();
		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);

		debouncedFn();
		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(2);
	});
});

describe("memoize", () => {
	it("caches function results", () => {
		const fn = vi.fn((x: number) => x * 2);
		const memoizedFn = memoize(fn);

		const result1 = memoizedFn(5);
		const result2 = memoizedFn(5);

		expect(result1).toBe(10);
		expect(result2).toBe(10);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("calls function again for different arguments", () => {
		const fn = vi.fn((x: number) => x * 2);
		const memoizedFn = memoize(fn);

		memoizedFn(5);
		memoizedFn(10);

		expect(fn).toHaveBeenCalledTimes(2);
	});

	it("handles multiple arguments", () => {
		const fn = vi.fn((a: number, b: number) => a + b);
		const memoizedFn = memoize(fn);

		memoizedFn(1, 2);
		memoizedFn(1, 2);
		memoizedFn(1, 3);

		expect(fn).toHaveBeenCalledTimes(2);
	});

	it("handles complex arguments", () => {
		const fn = vi.fn((obj: { x: number }) => obj.x * 2);
		const memoizedFn = memoize(fn);

		const obj1 = { x: 5 };
		const obj2 = { x: 5 };

		memoizedFn(obj1);
		memoizedFn(obj2);

		// JSON.stringify treats objects with same content as same key (correct memoization behavior)
		expect(fn).toHaveBeenCalledTimes(1);
		expect(memoizedFn(obj1)).toBe(10);
		expect(memoizedFn(obj2)).toBe(10);
	});
});

