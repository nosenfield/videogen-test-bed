import { describe, it, expect } from "vitest";
import { validateParameter, validateAllParameters } from "./validation.js";
import type { ModelParameter } from "../types/models.js";

describe("validateParameter", () => {
	it("validates string parameter", () => {
		const param: ModelParameter = {
			name: "prompt",
			type: "string",
			description: "Text prompt",
			default: "",
			required: true,
		};
		expect(validateParameter("test", param).valid).toBe(true);
		expect(validateParameter("", param).valid).toBe(false);
	});

	it("validates number parameter with range", () => {
		const param: ModelParameter = {
			name: "duration",
			type: "number",
			description: "Duration",
			default: 5,
			required: true,
			min: 1,
			max: 30,
		};
		expect(validateParameter(5, param).valid).toBe(true);
		expect(validateParameter(0, param).valid).toBe(false);
		expect(validateParameter(31, param).valid).toBe(false);
	});

	it("validates boolean parameter", () => {
		const param: ModelParameter = {
			name: "enable",
			type: "boolean",
			description: "Enable feature",
			default: false,
			required: true,
		};
		expect(validateParameter(true, param).valid).toBe(true);
		expect(validateParameter(false, param).valid).toBe(true);
	});

	it("validates select parameter", () => {
		const param: ModelParameter = {
			name: "quality",
			type: "select",
			description: "Quality",
			default: "high",
			required: true,
			options: [
				{ value: "low", label: "Low" },
				{ value: "high", label: "High" },
			],
		};
		expect(validateParameter("high", param).valid).toBe(true);
		expect(validateParameter("invalid", param).valid).toBe(false);
	});

	it("handles required parameter missing", () => {
		const param: ModelParameter = {
			name: "required",
			type: "string",
			description: "Required field",
			default: "",
			required: true,
		};
		const result = validateParameter(null, param);
		expect(result.valid).toBe(false);
		expect(result.error).toContain("required");
	});

	it("allows optional parameter to be null", () => {
		const param: ModelParameter = {
			name: "optional",
			type: "string",
			description: "Optional field",
			default: "",
			required: false,
		};
		expect(validateParameter(null, param).valid).toBe(true);
	});
});

describe("validateAllParameters", () => {
	it("validates all parameters successfully", () => {
		const params: ModelParameter[] = [
			{
				name: "prompt",
				type: "string",
				description: "Prompt",
				default: "",
				required: true,
			},
			{
				name: "duration",
				type: "number",
				description: "Duration",
				default: 5,
				required: true,
				min: 1,
				max: 30,
			},
		];
		const values = { prompt: "test", duration: 10 };
		const result = validateAllParameters(values, params);
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it("returns errors for invalid parameters", () => {
		const params: ModelParameter[] = [
			{
				name: "prompt",
				type: "string",
				description: "Prompt",
				default: "",
				required: true,
			},
			{
				name: "duration",
				type: "number",
				description: "Duration",
				default: 5,
				required: true,
				min: 1,
				max: 30,
			},
		];
		const values = { prompt: "", duration: 50 };
		const result = validateAllParameters(values, params);
		expect(result.valid).toBe(false);
		expect(result.errors.length).toBeGreaterThan(0);
	});
});

