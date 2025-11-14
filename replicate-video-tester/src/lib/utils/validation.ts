/**
 * Validation Utilities
 *
 * Functions for validating model parameters before submission.
 * Provides user-friendly error messages for invalid inputs.
 */

import type { ModelParameter } from "../types/models.js";

/**
 * Validation result
 */
export interface ValidationResult {
	/** Whether validation passed */
	valid: boolean;
	/** Error message if validation failed */
	error?: string;
}

/**
 * Validation result for multiple parameters
 */
export interface ValidationResults {
	/** Whether all validations passed */
	valid: boolean;
	/** Array of errors (one per invalid parameter) */
	errors: Array<{ parameter: string; error: string }>;
}

/**
 * Validate a single parameter value
 * @param value - The value to validate
 * @param param - The parameter definition
 * @returns Validation result
 */
export function validateParameter(
	value: unknown,
	param: ModelParameter
): ValidationResult {
	// Handle required parameters
	if (param.required && (value === null || value === undefined || value === "")) {
		return {
			valid: false,
			error: `${param.name} is required`,
		};
	}

	// Allow null/undefined for optional parameters
	if (!param.required && (value === null || value === undefined)) {
		return { valid: true };
	}

	// Type-specific validation
	switch (param.type) {
		case "string": {
			if (typeof value !== "string") {
				return {
					valid: false,
					error: `${param.name} must be a string`,
				};
			}
			if (param.required && value.trim() === "") {
				return {
					valid: false,
					error: `${param.name} cannot be empty`,
				};
			}
			break;
		}

		case "number": {
			if (typeof value !== "number" || isNaN(value)) {
				return {
					valid: false,
					error: `${param.name} must be a number`,
				};
			}
			if (param.min !== undefined && value < param.min) {
				return {
					valid: false,
					error: `${param.name} must be at least ${param.min}`,
				};
			}
			if (param.max !== undefined && value > param.max) {
				return {
					valid: false,
					error: `${param.name} must be at most ${param.max}`,
				};
			}
			break;
		}

		case "boolean": {
			if (typeof value !== "boolean") {
				return {
					valid: false,
					error: `${param.name} must be a boolean`,
				};
			}
			break;
		}

		case "select": {
			if (!param.options) {
				return {
					valid: false,
					error: `${param.name} has no valid options`,
				};
			}
			const validValues = param.options.map((opt) => opt.value);
			if (!validValues.includes(value as string | number)) {
				return {
					valid: false,
					error: `${param.name} must be one of: ${validValues.join(", ")}`,
				};
			}
			break;
		}
	}

	return { valid: true };
}

/**
 * Validate all parameters
 * @param values - Record of parameter values
 * @param params - Array of parameter definitions
 * @returns Validation results
 */
export function validateAllParameters(
	values: Record<string, unknown>,
	params: ModelParameter[]
): ValidationResults {
	const errors: Array<{ parameter: string; error: string }> = [];

	for (const param of params) {
		const value = values[param.name];
		const result = validateParameter(value, param);
		if (!result.valid && result.error) {
			errors.push({
				parameter: param.name,
				error: result.error,
			});
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

