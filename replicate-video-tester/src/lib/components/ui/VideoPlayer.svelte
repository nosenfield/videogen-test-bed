<script lang="ts">
	interface VideoMetadata {
		model?: string;
		duration?: number;
		cost?: number;
		createdAt?: string;
	}

	interface Props {
		videoUrl: string;
		metadata?: VideoMetadata;
	}

	let { videoUrl, metadata }: Props = $props();

	let videoElement = $state<HTMLVideoElement | null>(null);
	let fullscreenElement = $state<Element | null>(null);
	let showMetadata = $state(false);
	let volume = $state(1.0);
	let isValidUrl = $state(true);

	// Validate videoUrl prop and prevent rendering invalid URLs
	$effect(() => {
		if (!videoUrl || typeof videoUrl !== "string") {
			isValidUrl = false;
			return;
		}
		// Basic URL validation to prevent XSS - only allow http/https
		try {
			const url = new URL(videoUrl);
			// Only allow http and https protocols (data: protocol removed for security)
			if (!["http:", "https:"].includes(url.protocol)) {
				isValidUrl = false;
				return;
			}
			isValidUrl = true;
		} catch (error) {
			isValidUrl = false;
		}
	});

	// Derive playing state from video element
	const isPlaying = $derived(videoElement ? !videoElement.paused : false);
	const isFullscreen = $derived(!!fullscreenElement);

	async function togglePlay() {
		if (!videoElement) return;
		try {
			if (videoElement.paused) {
				await videoElement.play();
			} else {
				videoElement.pause();
			}
		} catch (error) {
			// Handle play error (e.g., autoplay restrictions)
			// Error handled silently - video element will remain paused
		}
	}

	async function toggleFullscreen() {
		if (!videoElement) return;
		try {
			if (!document.fullscreenElement) {
				await videoElement.requestFullscreen();
			} else {
				await document.exitFullscreen();
			}
		} catch (error) {
			// Handle fullscreen error (e.g., user denied permission)
			// Error handled silently - fullscreen state will remain unchanged
		}
	}

	function handleVolumeChange(event: Event) {
		if (!videoElement) return;
		const target = event.target as HTMLInputElement;
		const newVolume = parseFloat(target.value);
		volume = newVolume;
		videoElement.volume = newVolume;
	}

	function handleDownload() {
		if (!videoUrl) return;
		try {
			// Sanitize filename from URL or metadata
			const urlObj = new URL(videoUrl);
			const pathname = urlObj.pathname;
			const filename = pathname.split("/").pop() || `video-${crypto.randomUUID()}.mp4`;
			// Remove any potentially dangerous characters
			const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
			
			const link = document.createElement("a");
			link.href = videoUrl;
			link.download = sanitizedFilename;
			link.target = "_blank";
			link.rel = "noopener noreferrer";
			link.click();
		} catch (error) {
			// Fallback: open in new tab if download fails (e.g., cross-origin)
			window.open(videoUrl, "_blank", "noopener,noreferrer");
		}
	}

	$effect(() => {
		if (!videoElement) return;

		function handleFullscreenChange() {
			fullscreenElement = document.fullscreenElement;
		}

		// Play/pause state is derived from video.paused, no listeners needed
		document.addEventListener("fullscreenchange", handleFullscreenChange);

		// Cleanup function to remove event listener
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	});
</script>

<div class="video-player" onmouseenter={() => (showMetadata = true)} onmouseleave={() => (showMetadata = false)}>
	<div class="video-container">
		{#if isValidUrl}
			<video bind:this={videoElement} src={videoUrl} class="video" controls={false}></video>
		{:else}
			<div class="error-message">Invalid video URL</div>
		{/if}
		{#if showMetadata && metadata}
			<div class="metadata-overlay">
				{#if metadata.model}
					<div class="metadata-item">Model: {metadata.model}</div>
				{/if}
				{#if metadata.duration}
					<div class="metadata-item">Duration: {metadata.duration}s</div>
				{/if}
				{#if metadata.cost}
					<div class="metadata-item">Cost: ${metadata.cost.toFixed(4)}</div>
				{/if}
			</div>
		{/if}
	</div>
	<div class="controls">
		<button class="control-button" onclick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
			{isPlaying ? "⏸" : "▶"}
		</button>
		<div class="volume-control">
			<label for="volume-slider" class="sr-only">Volume</label>
			<input
				id="volume-slider"
				type="range"
				min="0"
				max="1"
				step="0.1"
				value={volume}
				oninput={handleVolumeChange}
				class="volume-slider"
				aria-label="Volume control"
			/>
			<span class="volume-label" aria-hidden="true">🔊</span>
		</div>
		<button class="control-button" onclick={toggleFullscreen} aria-label="Fullscreen">
			⛶
		</button>
		<button class="control-button" onclick={handleDownload} aria-label="Download">
			⬇
		</button>
	</div>
</div>

<style>
	.video-player {
		position: relative;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	.video-container {
		position: relative;
		width: 100%;
		background: #000;
		border-radius: 0.375rem;
		overflow: hidden;
	}

	.video {
		width: 100%;
		height: auto;
		display: block;
	}

	.metadata-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 0.5rem;
		font-size: 0.75rem;
	}

	.metadata-item {
		margin-bottom: 0.25rem;
	}

	.controls {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
		justify-content: center;
		align-items: center;
	}

	.volume-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.volume-slider {
		width: 100px;
		height: 4px;
		cursor: pointer;
	}

	.volume-label {
		font-size: 1rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.control-button {
		background: var(--primary);
		color: white;
		border: none;
		border-radius: 0.375rem;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 1rem;
		transition: opacity 0.2s;
	}

	.control-button:hover {
		opacity: 0.9;
	}

	.control-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error-message {
		padding: 2rem;
		text-align: center;
		color: var(--error);
		background: var(--bg-gray);
		border-radius: 0.375rem;
	}
</style>

