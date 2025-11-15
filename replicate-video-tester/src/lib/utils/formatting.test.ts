import { describe, it, expect } from "vitest";
import {
	formatCost,
	formatDuration,
	formatTimestamp,
	formatElapsedTime,
	formatErrorMessage,
} from "./formatting.js";

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

describe("formatErrorMessage", () => {
	it("returns generic message for null/undefined", () => {
		expect(formatErrorMessage(null)).toBe("An unexpected error occurred. Please try again.");
		expect(formatErrorMessage(undefined)).toBe("An unexpected error occurred. Please try again.");
	});

	it("formats API key errors", () => {
		expect(formatErrorMessage(new Error("API key is required"))).toContain("API key");
		expect(formatErrorMessage(new Error("Unauthorized"))).toContain("API key");
		expect(formatErrorMessage("401 Unauthorized")).toContain("API key");
	});

	it("formats rate limit errors", () => {
		expect(formatErrorMessage(new Error("Rate limit exceeded"))).toContain("Rate limit");
		expect(formatErrorMessage("429 Too Many Requests")).toContain("Rate limit");
		expect(formatErrorMessage("Quota exceeded")).toContain("Rate limit");
	});

	it("formats network errors", () => {
		expect(formatErrorMessage(new Error("Network error"))).toContain("Network error");
		expect(formatErrorMessage("Failed to fetch")).toContain("Network error");
		expect(formatErrorMessage("Connection timeout")).toContain("Network error");
	});

	it("keeps validation errors as-is", () => {
		const validationError = "Missing required parameter: prompt";
		expect(formatErrorMessage(validationError)).toBe(validationError);
		expect(formatErrorMessage(new Error("Invalid input"))).toContain("Invalid");
	});

	it("formats timeout errors", () => {
		expect(formatErrorMessage(new Error("Request timeout"))).toContain("too long");
		expect(formatErrorMessage("Timed out")).toContain("too long");
	});

	it("formats polling timeout errors", () => {
		expect(formatErrorMessage("Polling timeout: Generation did not complete")).toContain(
			"taking longer than expected"
		);
	});

	it("returns original message for reasonable length messages", () => {
		const shortMessage = "Custom error message";
		expect(formatErrorMessage(shortMessage)).toBe(shortMessage);
	});

	it("returns generic message for very long messages", () => {
		const longMessage = "A".repeat(300);
		expect(formatErrorMessage(longMessage)).toBe("An unexpected error occurred. Please try again.");
	});

	it("handles Error objects", () => {
		const error = new Error("Test error");
		expect(formatErrorMessage(error)).toBe("Test error");
	});

	it("handles string errors", () => {
		expect(formatErrorMessage("String error")).toBe("String error");
	});
});

