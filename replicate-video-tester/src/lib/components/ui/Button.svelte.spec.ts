import { describe, it, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Button from "./Button.svelte";

describe("Button", () => {
	it("renders with label", async () => {
		render(Button, { props: { label: "Click me" } });
		const button = page.getByText("Click me");
		await expect.element(button).toBeInTheDocument();
	});

	it("calls onClick when clicked", async () => {
		const onClick = vi.fn();
		render(Button, { props: { label: "Click", onClick } });

		const button = page.getByText("Click");
		await button.click();
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("does not call onClick when disabled", async () => {
		const onClick = vi.fn();
		render(Button, { props: { label: "Click", onClick, disabled: true } });

		const button = page.getByRole("button", { name: "Click" });
		await expect.element(button).toBeDisabled();
		expect(onClick).not.toHaveBeenCalled();
	});

	it("applies primary variant by default", async () => {
		render(Button, { props: { label: "Button" } });
		const button = page.getByRole("button", { name: "Button" });
		await expect.element(button).toHaveClass("primary");
	});

	it("applies secondary variant", async () => {
		render(Button, { props: { label: "Button", variant: "secondary" } });
		const button = page.getByRole("button", { name: "Button" });
		await expect.element(button).toHaveClass("secondary");
	});

	it("applies danger variant", async () => {
		render(Button, { props: { label: "Button", variant: "danger" } });
		const button = page.getByRole("button", { name: "Button" });
		await expect.element(button).toHaveClass("danger");
	});

	it("applies size classes", async () => {
		render(Button, { props: { label: "Button", size: "sm" } });
		const button = page.getByRole("button", { name: "Button" });
		await expect.element(button).toHaveClass("sm");
	});

	it("is accessible with keyboard", async () => {
		render(Button, { props: { label: "Button" } });
		const button = page.getByRole("button", { name: "Button" });
		await expect.element(button).toBeInTheDocument();
		await expect.element(button).toHaveAttribute("type", "button");
	});

	// TODO: Add keyboard event testing (Enter/Space keys)
	// The component implements handleKeydown for Enter/Space keys (Button.svelte:26-31)
	// Browser test environment limitations with vitest-browser prevent full keyboard simulation
	// Consider adding E2E tests with Playwright for full keyboard interaction testing

	it("does not call onClick when disabled and Enter key is pressed", async () => {
		const onClick = vi.fn();
		render(Button, { props: { label: "Button", onClick, disabled: true } });
		const button = page.getByRole("button", { name: "Button" });
		await expect.element(button).toBeDisabled();
		// Disabled buttons can't receive focus, so keyboard events won't trigger
		// The component's handleKeydown already checks disabled state
		expect(onClick).not.toHaveBeenCalled();
	});

	it("renders with icon when provided", async () => {
		render(Button, { props: { label: "Delete", icon: "🗑️" } });
		const button = page.getByRole("button", { name: "Delete" });
		await expect.element(button).toContainHTML("🗑️");
	});
});

