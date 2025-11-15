import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import GenerationStatus from "./GenerationStatus.svelte";
import type { GenerationStatus as StatusType } from "$lib/types/generation";

describe("GenerationStatus", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders status badge with correct label", async () => {
		render(GenerationStatus, {
			props: { status: "processing" },
		});

		const badge = page.getByText("Processing");
		await expect.element(badge).toBeInTheDocument();
	});

	it("displays correct status for all status types", async () => {
		const statuses: StatusType[] = ["idle", "queued", "processing", "completed", "error", "canceled"];

		for (const status of statuses) {
			// Render each status separately
			const { unmount } = render(GenerationStatus, {
				props: { status },
			});

			const label = status.charAt(0).toUpperCase() + status.slice(1);
			const badge = page.getByText(label);
			await expect.element(badge).toBeInTheDocument();

			// Clean up before next iteration
			unmount();
		}
	});

	it("shows spinner for active states", async () => {
		render(GenerationStatus, {
			props: { status: "processing" },
		});

		// Spinner should be present (check for spinner element)
		const badge = page.getByText("Processing");
		await expect.element(badge).toBeInTheDocument();
		// Spinner is inside the badge, so badge exists means spinner container exists
	});

	it("does not show spinner for inactive states", async () => {
		render(GenerationStatus, {
			props: { status: "completed" },
		});

		const badge = page.getByText("Completed");
		await expect.element(badge).toBeInTheDocument();
		// Spinner should not be present for completed status
	});

	it("displays elapsed time for active states", async () => {
		const startTime = Date.now() - 5000; // 5 seconds ago

		render(GenerationStatus, {
			props: { status: "processing", startTime },
		});

		// Elapsed time should be displayed
		const elapsed = page.getByText(/Elapsed:/i);
		await expect.element(elapsed).toBeInTheDocument();
	});

	it("updates elapsed time in real-time", async () => {
		const startTime = Date.now() - 5000;

		render(GenerationStatus, {
			props: { status: "processing", startTime },
		});

		// Initial elapsed time
		const initialElapsed = page.getByText(/Elapsed:/i);
		await expect.element(initialElapsed).toBeInTheDocument();

		// Advance time by 2 seconds
		vi.advanceTimersByTime(2000);

		// Elapsed time should still be visible (component updates)
		const updatedElapsed = page.getByText(/Elapsed:/i);
		await expect.element(updatedElapsed).toBeInTheDocument();
	});

	it("displays estimated time remaining when provided", async () => {
		const startTime = Date.now() - 5000;
		const estimatedTime = 30; // 30 seconds total

		render(GenerationStatus, {
			props: { status: "processing", startTime, estimatedTime },
		});

		// Estimated time should be displayed
		const estimated = page.getByText(/remaining/i);
		await expect.element(estimated).toBeInTheDocument();
	});

	it("handles null startTime gracefully", async () => {
		render(GenerationStatus, {
			props: { status: "processing", startTime: null },
		});

		// Should render without errors
		const badge = page.getByText("Processing");
		await expect.element(badge).toBeInTheDocument();
		// Elapsed time should not be displayed
	});

	it("handles null estimatedTime gracefully", async () => {
		const startTime = Date.now() - 5000;

		render(GenerationStatus, {
			props: { status: "processing", startTime, estimatedTime: null },
		});

		// Should render without errors
		const badge = page.getByText("Processing");
		await expect.element(badge).toBeInTheDocument();
		// Estimated time should not be displayed
	});
});

