import { describe, it, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Input from "./Input.svelte";

describe("Input", () => {
	it("renders with value", async () => {
		render(Input, { props: { value: "test", onChange: vi.fn() } });
		const input = page.getByRole("textbox");
		await expect.element(input).toHaveValue("test");
	});

	it("calls onChange when value changes", async () => {
		const onChange = vi.fn();
		render(Input, { props: { value: "", onChange } });
		const input = page.getByRole("textbox");
		await input.fill("new value");
		expect(onChange).toHaveBeenCalledWith("new value");
	});

	it("displays placeholder", async () => {
		render(Input, { props: { value: "", onChange: vi.fn(), placeholder: "Enter text" } });
		const input = page.getByRole("textbox");
		await expect.element(input).toHaveAttribute("placeholder", "Enter text");
	});

	it("supports text type", async () => {
		render(Input, { props: { value: "", onChange: vi.fn(), type: "text" } });
		const input = page.getByRole("textbox");
		await expect.element(input).toHaveAttribute("type", "text");
	});

	it("supports number type", async () => {
		render(Input, { props: { value: "", onChange: vi.fn(), type: "number" } });
		const input = page.getByRole("spinbutton");
		await expect.element(input).toHaveAttribute("type", "number");
	});

	it("supports password type", async () => {
		render(Input, { props: { value: "", onChange: vi.fn(), type: "password", label: "Password" } });
		const input = page.getByLabelText("Password");
		await expect.element(input).toHaveAttribute("type", "password");
	});

	it("displays error state", async () => {
		render(Input, { props: { value: "", onChange: vi.fn(), error: "Invalid input" } });
		const input = page.getByRole("textbox");
		await expect.element(input).toHaveClass("error");
		const errorText = page.getByText("Invalid input");
		await expect.element(errorText).toBeInTheDocument();
	});

	it("is disabled when disabled prop is true", async () => {
		render(Input, { props: { value: "", onChange: vi.fn(), disabled: true } });
		const input = page.getByRole("textbox");
		await expect.element(input).toBeDisabled();
	});

	it("displays label when provided", async () => {
		render(Input, { props: { value: "", onChange: vi.fn(), label: "Username" } });
		const label = page.getByText("Username");
		await expect.element(label).toBeInTheDocument();
		const input = page.getByLabelText("Username");
		await expect.element(input).toBeInTheDocument();
	});
});

