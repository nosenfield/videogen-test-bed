import { describe, it, expect } from "vitest";
import { formatCost, formatDuration, formatTimestamp, formatElapsedTime } from "./formatting.js";

describe("formatCost", () => {
	it("formats cost in dollars with 4 decimal places", () => {
		expect(formatCost(0.1234)).toBe("$0.1234");
		expect(formatCost(1.5)).toBe("$1.5000");
		expect(formatCost(0.0001)).toBe("$0.0001");
	});

	it("handles zero", () => {
		expect(formatCost(0)).toBe("$0.0000");
	});

	it("handles null", () => {
		expect(formatCost(null)).toBe("$0.0000");
	});

	it("handles undefined", () => {
		expect(formatCost(undefined)).toBe("$0.0000");
	});
});

describe("formatDuration", () => {
	it("formats seconds as MM:SS", () => {
		expect(formatDuration(0)).toBe("00:00");
		expect(formatDuration(30)).toBe("00:30");
		expect(formatDuration(60)).toBe("01:00");
		expect(formatDuration(90)).toBe("01:30");
		expect(formatDuration(3661)).toBe("61:01");
	});

	it("handles null", () => {
		expect(formatDuration(null)).toBe("00:00");
	});

	it("handles undefined", () => {
		expect(formatDuration(undefined)).toBe("00:00");
	});
});

describe("formatTimestamp", () => {
	it("formats timestamp as readable date", () => {
		const timestamp = 1700000000000; // 2023-11-14
		const result = formatTimestamp(timestamp);
		expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
	});

	it("handles null", () => {
		expect(formatTimestamp(null)).toBe("—");
	});

	it("handles undefined", () => {
		expect(formatTimestamp(undefined)).toBe("—");
	});
});

describe("formatElapsedTime", () => {
	it("calculates elapsed time from start time", () => {
		const now = Date.now();
		const startTime = now - 5000; // 5 seconds ago
		const result = formatElapsedTime(startTime);
		expect(result).toMatch(/\d+s/);
	});

	it("handles null", () => {
		expect(formatElapsedTime(null)).toBe("—");
	});

	it("handles undefined", () => {
		expect(formatElapsedTime(undefined)).toBe("—");
	});

	it("handles future timestamps", () => {
		const future = Date.now() + 1000;
		expect(formatElapsedTime(future)).toBe("0s");
	});
});

