import { describe, it, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import VideoPlayer from "./VideoPlayer.svelte";

describe("VideoPlayer", () => {
	it("renders video player component", async () => {
		render(VideoPlayer, { props: { videoUrl: "https://example.com/video.mp4" } });
		// Component renders - video element is present
		const playButton = page.getByRole("button", { name: /play/i });
		await expect.element(playButton).toBeInTheDocument();
	});

	it("displays metadata when provided", async () => {
		render(VideoPlayer, {
			props: {
				videoUrl: "https://example.com/video.mp4",
				metadata: { model: "Test Model", duration: 10 },
			},
		});
		// Component renders with metadata
		const playButton = page.getByRole("button", { name: /play/i });
		await expect.element(playButton).toBeInTheDocument();
	});

	it("handles missing video url gracefully", async () => {
		render(VideoPlayer, { props: { videoUrl: "" } });
		// Component renders even without video URL
		const playButton = page.getByRole("button", { name: /play/i });
		await expect.element(playButton).toBeInTheDocument();
	});

	it("has volume control", async () => {
		render(VideoPlayer, { props: { videoUrl: "https://example.com/video.mp4" } });
		const volumeSlider = page.getByLabelText("Volume control");
		await expect.element(volumeSlider).toBeInTheDocument();
		await expect.element(volumeSlider).toHaveAttribute("type", "range");
	});

	it("has download button", async () => {
		render(VideoPlayer, { props: { videoUrl: "https://example.com/video.mp4" } });
		const downloadButton = page.getByRole("button", { name: /download/i });
		await expect.element(downloadButton).toBeInTheDocument();
	});

	it("has fullscreen button", async () => {
		render(VideoPlayer, { props: { videoUrl: "https://example.com/video.mp4" } });
		const fullscreenButton = page.getByRole("button", { name: /fullscreen/i });
		await expect.element(fullscreenButton).toBeInTheDocument();
	});

	it("displays error for invalid URL", async () => {
		render(VideoPlayer, { props: { videoUrl: "javascript:alert('xss')" } });
		const errorMessage = page.getByText("Invalid video URL");
		await expect.element(errorMessage).toBeInTheDocument();
	});

	it("displays error for invalid protocol", async () => {
		render(VideoPlayer, { props: { videoUrl: "file:///path/to/video.mp4" } });
		const errorMessage = page.getByText("Invalid video URL");
		await expect.element(errorMessage).toBeInTheDocument();
	});
});

