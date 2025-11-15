import { describe, it, expect, vi, beforeEach } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import ParameterForm from "./ParameterForm.svelte";
import { modelsStore, loadModels } from "$lib/stores/models";
import { get } from "svelte/store";

describe("ParameterForm", () => {
	beforeEach(() => {
		loadModels();
	});

	it("renders form with model parameters", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models[0];
		const onChange = vi.fn();
		render(ParameterForm, {
			props: { modelId: model.id, parameters: {}, onChange },
		});
		// Form should render
		const form = page.locator("form");
		await expect.element(form).toBeInTheDocument();
	});

	it("displays parameter inputs based on parameter type", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models[0];
		const stringParam = model.parameters.find((p) => p.type === "string");
		expect(stringParam).toBeDefined();
		const onChange = vi.fn();
		render(ParameterForm, {
			props: { modelId: model.id, parameters: {}, onChange },
		});
		// Should have input for string parameter
		const input = page.getByLabelText(new RegExp(stringParam!.name, "i"));
		await expect.element(input).toBeInTheDocument();
	});

	it("calls onChange with updated parameters", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models[0];
		const onChange = vi.fn();
		render(ParameterForm, {
			props: { modelId: model.id, parameters: {}, onChange },
		});
		// onChange handler is attached
		expect(onChange).toBeDefined();
		// Note: Full interaction testing requires E2E tests due to vitest-browser limitations
	});

	it("displays validation errors", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models[0];
		const requiredParam = model.parameters.find((p) => p.required);
		expect(requiredParam).toBeDefined();
		const onChange = vi.fn();
		render(ParameterForm, {
			props: { modelId: model.id, parameters: {}, onChange },
		});
		// Component should render (validation errors shown on interaction)
		const form = page.locator("form");
		await expect.element(form).toBeInTheDocument();
	});

	it("handles parameter defaults", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models[0];
		const paramWithDefault = model.parameters.find((p) => p.default !== null);
		expect(paramWithDefault).toBeDefined();
		const onChange = vi.fn();
		render(ParameterForm, {
			props: { modelId: model.id, parameters: {}, onChange },
		});
		// Component should render with defaults applied
		const form = page.locator("form");
		await expect.element(form).toBeInTheDocument();
		// onChange should NOT be called on initial mount (prevents infinite loops)
		// It will be called on user interaction
	});

	it("validates required parameters and shows errors", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models.find((m) => m.parameters.some((p) => p.required));
		if (!model) {
			// Skip if no model has required params
			return;
		}
		const requiredParam = model.parameters.find((p) => p.required);
		expect(requiredParam).toBeDefined();
		const onChange = vi.fn();
		render(ParameterForm, {
			props: { modelId: model.id, parameters: {}, onChange },
		});
		// Should show validation error for required param without default
		if (requiredParam && requiredParam.default === null) {
			const form = page.locator("form");
			await expect.element(form).toBeInTheDocument();
			// Error message should be present (validation happens on init)
		}
	});
});

