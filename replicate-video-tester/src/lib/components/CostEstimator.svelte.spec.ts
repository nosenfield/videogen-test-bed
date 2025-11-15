import { describe, it, expect, beforeEach } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import { get } from "svelte/store";
import CostEstimator from "./CostEstimator.svelte";
import { modelsStore, loadModels } from "$lib/stores/models";

describe("CostEstimator", () => {
	beforeEach(() => {
		loadModels();
	});

	it("renders estimated cost for model", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models[0];

		render(CostEstimator, {
			props: { modelId: model.id, parameters: {} },
		});

		const costLabel = page.getByText(/Estimated Cost/i);
		await expect.element(costLabel).toBeInTheDocument();
	});

	it("displays actual cost when provided", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models[0];

		render(CostEstimator, {
			props: { modelId: model.id, parameters: {}, actualCost: 0.75 },
		});

		const costLabel = page.getByText(/^Cost:/i);
		await expect.element(costLabel).toBeInTheDocument();
	});

	it("calculates cost based on duration for per-second pricing", async () => {
		const models = get(modelsStore);
		const model = models.find((m) => m.pricing.unit === "per second");
		expect(model).toBeDefined();

		if (model) {
			render(CostEstimator, {
				props: { modelId: model.id, parameters: { duration: 10 } },
			});

			// Should display estimated cost
			const costLabel = page.getByText(/Estimated Cost/i);
			await expect.element(costLabel).toBeInTheDocument();
		}
	});

	it("displays cost range for estimated costs", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models[0];

		render(CostEstimator, {
			props: { modelId: model.id, parameters: {} },
		});

		// Cost range should be displayed
		const range = page.getByText(/Range:/i);
		await expect.element(range).toBeInTheDocument();
	});

	it("shows cost breakdown with model pricing info", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models[0];

		render(CostEstimator, {
			props: { modelId: model.id, parameters: {} },
		});

		// Breakdown should show base cost
		const baseCost = page.getByText(/Base cost:/i);
		await expect.element(baseCost).toBeInTheDocument();
	});

	it("handles missing model gracefully", async () => {
		render(CostEstimator, {
			props: { modelId: "nonexistent/model", parameters: {} },
		});

		// Should render without errors
		const costLabel = page.getByText(/^Cost:/i);
		await expect.element(costLabel).toBeInTheDocument();
	});

	it("handles null actualCost", async () => {
		const models = get(modelsStore);
		expect(models.length).toBeGreaterThan(0);
		const model = models[0];

		render(CostEstimator, {
			props: { modelId: model.id, parameters: {}, actualCost: null },
		});

		// Should show estimated cost
		const costLabel = page.getByText(/Estimated Cost/i);
		await expect.element(costLabel).toBeInTheDocument();
	});
});

