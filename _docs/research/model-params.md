# Video Generation Model Parameters - Comprehensive Reference

This document provides a detailed comparison of all available parameters for 13 video generation models integrated into our pipeline.

---

## 1. Google Veo 3 (`google/veo-3`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | - | Text prompt for video generation |
| `aspect_ratio` | enum | ❌ No | `16:9` | `16:9`, `9:16` | Video aspect ratio |
| `duration` | integer | ❌ No | `8` | `4`, `6`, `8` | Video duration in seconds |
| `image` | URI | ❌ No | null | - | Input image to start generation (16:9 or 9:16, 1280x720 or 720x1280) |
| `negative_prompt` | string | ❌ No | null | - | Description of what to exclude from the video |
| `resolution` | enum | ❌ No | `1080p` | `720p`, `1080p` | Resolution of the generated video |
| `generate_audio` | boolean | ❌ No | `true` | `true`, `false` | Generate audio with the video |
| `seed` | integer | ❌ No | null | - | Random seed for reproducible generation |

### Pricing
- With audio: **$0.40/second**
- Without audio: **$0.20/second**

### Output Format
- Video file (URI)
- Resolution: 720p or 1080p
- Duration: 4-8 seconds

---

## 2. Kling 2.5 Turbo Pro (`kwaivgi/kling-v2.5-turbo-pro`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | Max 2500 chars | Text prompt for video generation |
| `start_image` | URI | ❌ No | null | - | First frame of the video (replaces deprecated `image`) |
| `duration` | integer | ❌ No | `5` | `5`, `10` | Duration of the video in seconds |
| `aspect_ratio` | enum | ❌ No | `16:9` | `16:9`, `9:16`, `1:1` | Aspect ratio (ignored if start_image provided) |
| `negative_prompt` | string | ❌ No | `""` | - | Things you do not want to see in the video |
| `cfg_scale` | number | ❌ No | `0.5` | 0-1 | Classifier Free Guidance scale (prompt adherence) |

### Pricing
- **$0.07/second** (~14 seconds per $1)

### Output Format
- Video file (URI)
- Resolution: 1080p Full HD
- Duration: 5-10 seconds

---

## 3. Wan 2.5 T2V (`wan-video/wan-2.5-t2v`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | - | Text prompt for video generation |
| `negative_prompt` | string | ❌ No | `""` | - | Negative prompt to avoid certain elements |
| `size` | enum | ❌ No | `1280*720` | `832*480`, `480*832`, `1280*720`, `720*1280`, `1920*1080`, `1080*1920` | Video resolution and aspect ratio |
| `duration` | integer | ❌ No | `5` | `5`, `10` | Duration in seconds |
| `audio` | URI | ❌ No | null | wav/mp3, 3-30s, ≤15MB | Audio file for voice/music synchronization |
| `seed` | integer | ❌ No | null | - | Random seed for reproducible generation |
| `enable_prompt_expansion` | boolean | ❌ No | `true` | `true`, `false` | Enable prompt optimizer |

### Pricing
- Estimated: **$0.10/second**

### Output Format
- Video file (URI)
- Multiple resolution options
- Duration: 5-10 seconds

---

## 4. Hailuo 2 (`minimax/hailuo-02`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | - | Text prompt for generation |
| `duration` | integer | ❌ No | `6` | `6`, `10` | Duration in seconds (10s only for 768p) |
| `resolution` | enum | ❌ No | `1080p` | `512p`, `768p`, `1080p` | Quality tier selection |
| `first_frame_image` | URI | ❌ No | null | - | First frame image (output matches aspect ratio) |
| `last_frame_image` | URI | ❌ No | null | - | Last frame image for transitions |
| `prompt_optimizer` | boolean | ❌ No | `true` | `true`, `false` | Use prompt optimizer |

### Pricing
- Estimated: **$0.08/second**

### Output Format
- Video file (URI)
- Resolution: 512p-1080p
- Duration: 6-10 seconds

---

## 5. PixVerse v4 (`pixverse/pixverse-v4`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | - | Text description for video generation |
| `quality` | enum | ❌ No | `540p` | `360p`, `540p`, `720p`, `1080p` | Output quality |
| `duration` | integer | ❌ No | `5` | `5`, `8` | Duration in seconds |
| `aspect_ratio` | enum | ❌ No | `16:9` | `16:9`, `9:16`, `1:1` | Video aspect ratio |
| `motion_mode` | enum | ❌ No | `normal` | `normal`, `smooth` | Motion quality (smooth only for 5s) |
| `style` | enum | ❌ No | `None` | `None`, `anime`, `3d_animation`, `clay`, `cyberpunk`, `comic` | Visual style preset |
| `effect` | enum | ❌ No | `None` | 15+ options including `Let's YMCA!`, `Subject 3 Fever`, `Ghibli Live!`, etc. | Special effects (incompatible with last_frame_image) |
| `negative_prompt` | string | ❌ No | `""` | - | Elements to exclude |
| `seed` | integer | ❌ No | null | - | Random seed |
| `image` | URI | ❌ No | null | - | First frame image |
| `last_frame_image` | URI | ❌ No | null | - | Last frame for transitions (requires image) |
| `sound_effect_switch` | boolean | ❌ No | `false` | `true`, `false` | Enable background music/sound effects |
| `sound_effect_content` | string | ❌ No | null | - | Custom sound effect prompt |

### Constraints
- 1080p does not support 8-second duration or smooth motion
- Smooth motion only available with 5-second duration
- Effects incompatible with last_frame_image

### Pricing
- Estimated: **$0.09/second**

### Output Format
- Video file (URI)
- Resolution: 360p-1080p
- Duration: 5-8 seconds

---

## 6. Seedance 1 Pro (`bytedance/seedance-1-pro`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | - | Text prompt for video generation |
| `image` | URI | ❌ No | null | - | Input image for image-to-video |
| `last_frame_image` | URI | ❌ No | null | - | Last frame image (requires start frame) |
| `duration` | integer | ❌ No | `5` | Min: 2, Max: 12 | Video duration in seconds |
| `resolution` | enum | ❌ No | `1080p` | `480p`, `720p`, `1080p` | Video resolution |
| `aspect_ratio` | enum | ❌ No | `16:9` | `16:9`, `4:3`, `1:1`, `3:4`, `9:16`, `21:9`, `9:21` | Aspect ratio (ignored if image used) |
| `camera_fixed` | boolean | ❌ No | `false` | `true`, `false` | Fix camera position for stable shots |
| `fps` | integer | ❌ No | `24` | `24` | Frame rate (fixed at 24) |
| `seed` | integer | ❌ No | null | - | Random seed |

### Pricing
- **480p**: $0.03/second (~33 seconds per $1)
- **720p**: $0.06/second (~16 seconds per $1)
- **1080p**: $0.15/second (~6.6 seconds per $1)

### Output Format
- Video file (URI)
- Resolution: 480p-1080p at 24fps
- Duration: 2-12 seconds
- 7 aspect ratios supported

---

## 7. Wan 2.2 Fast (`wan-video/wan-2.2-t2v-fast`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | - | Prompt for video generation |
| `num_frames` | integer | ❌ No | `81` | Min: 81, Max: 121 | Number of frames (81 gives best results) |
| `aspect_ratio` | enum | ❌ No | `16:9` | `16:9`, `9:16` | Aspect ratio (16:9=832x480, 9:16=480x832) |
| `resolution` | enum | ❌ No | `480p` | `480p`, `720p` | Video resolution |
| `frames_per_second` | integer | ❌ No | `16` | Min: 5, Max: 30 | FPS (pricing based on 16fps) |
| `go_fast` | boolean | ❌ No | `true` | `true`, `false` | Speed optimization |
| `interpolate_output` | boolean | ❌ No | `true` | `true`, `false` | Interpolate to 30 FPS using ffmpeg |
| `optimize_prompt` | boolean | ❌ No | `false` | `true`, `false` | Translate prompt to Chinese |
| `sample_shift` | number | ❌ No | `12` | Min: 1, Max: 20 | Sample shift factor |
| `seed` | integer | ❌ No | null | - | Random seed |
| `disable_safety_checker` | boolean | ❌ No | `false` | `true`, `false` | Disable safety checker |
| `lora_weights_transformer` | URI | ❌ No | null | .safetensors URL | LoRA weights for transformer |
| `lora_scale_transformer` | number | ❌ No | `1` | - | Transformer LoRA strength |
| `lora_weights_transformer_2` | URI | ❌ No | null | .safetensors URL | LoRA weights for transformer_2 |
| `lora_scale_transformer_2` | number | ❌ No | `1` | - | Transformer_2 LoRA strength |

### Pricing
- Estimated: **$0.05/second** (fastest, cheapest model)

### Output Format
- Video file (URI)
- Resolution: 480p or 720p
- Frame rate: 5-30 fps (or interpolated to 30fps)
- Generation time: ~30-40 seconds for 5s video

---

## 8. Veo 3 Fast (`google/veo-3-fast`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | - | Text prompt for video generation |
| `aspect_ratio` | enum | ❌ No | `16:9` | `16:9`, `9:16` | Video aspect ratio |
| `duration` | integer | ❌ No | `8` | `4`, `6`, `8` | Video duration in seconds |
| `image` | URI | ❌ No | null | - | Input image (1280x720 or 720x1280 recommended) |
| `negative_prompt` | string | ❌ No | null | - | What to exclude from the video |
| `resolution` | enum | ❌ No | `1080p` | `720p`, `1080p` | Video resolution |
| `generate_audio` | boolean | ❌ No | `true` | `true`, `false` | Generate audio with video |
| `seed` | integer | ❌ No | null | - | Random seed |

### Pricing
- Estimated: **$0.07/second**

### Output Format
- Video file (URI)
- Resolution: 720p or 1080p
- Duration: 4-8 seconds
- Faster generation than Veo 3.1

---

## 9. LTX-Video (`lightricks/ltx-video`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | "best quality, 4k, HDR..." | - | Text prompt (needs long descriptive prompts) |
| `negative_prompt` | string | ❌ No | "low quality..." | - | Things to exclude |
| `image` | URI | ❌ No | null | - | Optional starting frame |
| `image_noise_scale` | number | ❌ No | `0.15` | Min: 0, Max: 1 | Lower = stick closer to input image |
| `target_size` | integer | ❌ No | `640` | `512`, `576`, `640`, `704`, `768`, `832`, `896`, `960`, `1024` | Output video size |
| `aspect_ratio` | enum | ❌ No | `3:2` | `1:1`, `1:2`, `2:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `9:21`, `21:9` | Video aspect ratio (13 options) |
| `cfg` | number | ❌ No | `3` | Min: 1, Max: 20 | How strongly video follows prompt |
| `steps` | integer | ❌ No | `30` | Min: 1, Max: 50 | Number of processing steps |
| `length` | integer | ❌ No | `97` | `97`, `129`, `161`, `193`, `225`, `257` | Length in frames |
| `model` | enum | ❌ No | `0.9.1` | `0.9.1`, `0.9` | Model version |
| `seed` | integer | ❌ No | random | - | Seed for reproducibility |

### Pricing
- Estimated: **$0.03/second** (most cost-effective)
- ~$0.081 per run (~12 runs per $1)

### Output Format
- Video file array (URI)
- H.264 MP4 format
- 24-25 FPS
- Real-time generation (faster than playback)
- Resolution: divisible by 32
- Frames: divisible by 8 + 1
- Best under 720x1280 and <257 frames

---

## 10. Minimax video-01 (`minimax/video-01`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | - | Text prompt for generation |
| `first_frame_image` | URI | ❌ No | null | - | First frame (output matches aspect ratio) |
| `subject_reference` | URI | ❌ No | null | - | Character reference image (uses S2V-01 model) |
| `prompt_optimizer` | boolean | ❌ No | `true` | `true`, `false` | Use prompt optimizer |

### Pricing
- **$0.50 per video**
- Bulk: 20 videos for $10

### Output Format
- Video file (URI)
- Resolution: 720p
- Frame rate: 25fps
- Duration: Up to 6 seconds

---

## Parameter Comparison Matrix

### Common Parameters

| Parameter | Veo 3 | Kling 2.5 | Wan 2.5 | Hailuo 2 | PixVerse | Seedance | Wan 2.2F | Veo 3F | LTX | Minimax |
|-----------|:-----:|:---------:|:-------:|:--------:|:--------:|:--------:|:--------:|:------:|:---:|:-------:|
| **prompt** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **negative_prompt** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **duration** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ❌ |
| **aspect_ratio** | ✅ | ✅ | ⚠️ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| **resolution** | ✅ | ❌ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| **seed** | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **image/first_frame** | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **last_frame_image** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

✅ = Fully supported | ⚠️ = Alternative parameter | ❌ = Not supported

### Unique Advanced Parameters

| Model | Unique Parameters |
|-------|-------------------|
| **Veo 3 / Veo 3 Fast** | `generate_audio` |
| **Kling 2.5** | `cfg_scale` |
| **Wan 2.5** | `audio` (sync), `enable_prompt_expansion`, `size` (combined res/ratio) |
| **PixVerse v4** | `quality`, `motion_mode`, `style`, `effect`, `sound_effect_switch`, `sound_effect_content` |
| **Seedance 1 Pro** | `camera_fixed`, `fps` |
| **Wan 2.2 Fast** | `num_frames`, `frames_per_second`, `go_fast`, `interpolate_output`, `optimize_prompt`, `sample_shift`, `lora_weights_*`, `disable_safety_checker` |
| **LTX-Video** | `image_noise_scale`, `target_size`, `cfg`, `steps`, `length` (frames), `model` (version) |
| **Minimax video-01** | `subject_reference`, `prompt_optimizer` |
| **Hailuo 2** | `prompt_optimizer` |

---

## Key Insights

### Resolution Options
- **Highest**: Veo 3, Seedance, PixVerse (1080p)
- **Medium**: Most models (720p)
- **Budget**: Wan 2.2 Fast, LTX-Video (480p+)

### Duration Range
- **Longest**: Seedance (2-12 seconds)
- **Standard**: Most models (4-10 seconds)
- **Shortest**: Minimax (up to 6 seconds)

### Cost Efficiency
1. **LTX-Video**: $0.03/second (best for development)
2. **Wan 2.2 Fast**: $0.05/second
3. **Minimax**: $0.50 flat per video
4. **Seedance 480p**: $0.03/second
5. **Veo 3**: $0.20-$0.40/second (premium)

### Feature Richness
- **Most Parameters**: Wan 2.2 Fast (15 parameters)
- **Most Aspect Ratios**: LTX-Video (13 options), Seedance (7 options)
- **Style Control**: PixVerse v4 (styles + effects)
- **Audio Generation**: Veo 3, Veo 3 Fast
- **Audio Sync**: Wan 2.5

### Image-to-Video Support
- **With Last Frame**: PixVerse v4, Seedance, Hailuo 2
- **First Frame Only**: Veo 3, Kling 2.5, LTX-Video, Minimax
- **Character Reference**: Minimax (subject_reference)
- **Text Only**: Wan 2.2 Fast

---

## Recommendations by Use Case

### High-Quality Production
1. **Veo 3** - Best overall quality, audio generation
2. **Seedance 1 Pro** - Longest duration, fixed camera option
3. **Kling 2.5** - Great prompt adherence with CFG control

### Fast Iteration & Development
1. **LTX-Video** - Real-time generation, very low cost
2. **Wan 2.2 Fast** - 30-second generation time, cheapest
3. **Veo 3 Fast** - Faster than premium Veo 3

### Creative Control
1. **PixVerse v4** - Styles, effects, sound effects
2. **LTX-Video** - 13 aspect ratios, frame-level control
3. **Wan 2.2 Fast** - LoRA support, extensive tuning

### Image Animation
1. **Seedance 1 Pro** - First-to-last frame transitions
2. **PixVerse v4** - Last frame with effects
3. **Hailuo 2** - First/last frame, high quality

### Budget-Conscious
1. **Minimax** - Flat $0.50 per video (6s)
2. **Seedance 480p** - $0.03/second
3. **LTX-Video** - $0.03/second + fast generation

---

## 11. Seedance 1 Pro Fast (`bytedance/seedance-1-pro-fast`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | - | Text prompt for video generation |
| `image` | URI | ❌ No | null | - | Input image for image-to-video |
| `duration` | integer | ❌ No | `5` | Min: 2, Max: 12 | Video duration in seconds |
| `resolution` | enum | ❌ No | `1080p` | `480p`, `720p`, `1080p` | Video resolution |
| `aspect_ratio` | enum | ❌ No | `16:9` | `16:9`, `4:3`, `1:1`, `3:4`, `9:16`, `21:9`, `9:21` | Aspect ratio (ignored if image used) |
| `camera_fixed` | boolean | ❌ No | `false` | `true`, `false` | Fix camera position for stable shots |
| `fps` | integer | ❌ No | `24` | `24` | Frame rate (fixed at 24) |
| `seed` | integer | ❌ No | null | - | Random seed |

### Pricing
- Lower cost than Pro version (optimized for faster inference)
- Estimated similar tiered pricing structure

### Output Format
- Video file (URI)
- Resolution: 480p-1080p at 24fps
- Duration: 2-12 seconds
- 7 aspect ratios supported
- Faster generation than Pro version

### Notes
- Optimized for faster inference and lower compute cost
- No last_frame_image support (vs. Pro version)
- Runs on CPU hardware

---

## 12. Wan 2.5 I2V Fast (`wan-video/wan-2.5-i2v-fast`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `image` | URI | ✅ Yes | - | - | Input image for video generation |
| `prompt` | string | ✅ Yes | - | - | Text prompt for video generation |
| `duration` | integer | ❌ No | `5` | `5`, `10` | Duration in seconds |
| `resolution` | enum | ❌ No | `720p` | `720p`, `1080p` | Video resolution |
| `negative_prompt` | string | ❌ No | `""` | - | Negative prompt to avoid elements |
| `seed` | integer | ❌ No | null | - | Random seed for reproducible generation |
| `audio` | URI | ❌ No | null | wav/mp3, 3-30s, ≤15MB | Audio file for voice/music synchronization |
| `enable_prompt_expansion` | boolean | ❌ No | `true` | `true`, `false` | Enable prompt optimizer |

### Pricing
- **720p**: $0.068/second (~14 seconds per $1)
- **1080p**: $0.102/second (~9.8 seconds per $1)

### Output Format
- Video file (URI)
- Resolution: 720p or 1080p
- Duration: 5-10 seconds
- Image-to-video focused (image required)

### Notes
- Fast variant optimized for image-to-video
- Supports audio synchronization
- Lower resolution options than T2V variant

---

## 13. Kling v1.6 Pro (`kwaivgi/kling-v1.6-pro`)

### Parameters

| Parameter | Type | Required | Default | Options/Range | Description |
|-----------|------|----------|---------|---------------|-------------|
| `prompt` | string | ✅ Yes | - | - | Text prompt for video generation |
| `duration` | integer | ❌ No | `5` | `5`, `10` | Duration of the video in seconds |
| `cfg_scale` | number | ❌ No | `0.5` | 0-1 | Flexibility in video generation (higher = stricter prompt adherence) |
| `start_image` | URI | ⚠️ Conditional | null | - | First frame of the video (start or end required) |
| `end_image` | URI | ⚠️ Conditional | null | - | Last frame of the video (start or end required) |
| `aspect_ratio` | enum | ❌ No | `16:9` | `16:9`, `9:16`, `1:1` | Aspect ratio (ignored if start_image provided) |
| `negative_prompt` | string | ❌ No | `""` | - | Things you do not want to see |
| `reference_images` | array[URI] | ❌ No | null | Max 4 images | Reference images for scene elements |

### Pricing
- Estimated premium pricing (older generation than v2.5)

### Output Format
- Video file (URI)
- Resolution: 1080p
- Duration: 5-10 seconds

### Notes
- Requires either start_image OR end_image (at least one)
- Unique reference_images feature (up to 4 scene elements)
- Both first and last frame control available
- Previous generation model (v2.5 is newer)

---

## Comprehensive Comparison Matrix

### All Models Overview

| # | Model | ID | Type | Max Duration | Max Resolution | Pricing ($/sec) |
|---|-------|-----|------|--------------|----------------|-----------------|
| 1 | Google Veo 3 | `google/veo-3` | T2V, I2V | 8s | 1080p | $0.20-$0.40 |
| 2 | Kling 2.5 Turbo Pro | `kwaivgi/kling-v2.5-turbo-pro` | T2V, I2V | 10s | 1080p | $0.07 |
| 3 | Wan 2.5 T2V | `wan-video/wan-2.5-t2v` | T2V | 10s | 1080p | $0.10 |
| 4 | Hailuo 2 | `minimax/hailuo-02` | T2V, I2V | 10s | 1080p | $0.08 |
| 5 | PixVerse v4 | `pixverse/pixverse-v4` | T2V, I2V | 8s | 1080p | $0.09 |
| 6 | Seedance 1 Pro | `bytedance/seedance-1-pro` | T2V, I2V | 12s | 1080p | $0.03-$0.15 |
| 7 | Wan 2.2 Fast | `wan-video/wan-2.2-t2v-fast` | T2V | ~5s | 720p | $0.05 |
| 8 | Veo 3 Fast | `google/veo-3-fast` | T2V, I2V | 8s | 1080p | $0.07 |
| 9 | LTX-Video | `lightricks/ltx-video` | T2V, I2V | ~10s | 1024px | $0.03 |
| 10 | Minimax video-01 | `minimax/video-01` | T2V, I2V | 6s | 720p | $0.50 flat |
| 11 | Seedance 1 Pro Fast | `bytedance/seedance-1-pro-fast` | T2V, I2V | 12s | 1080p | Est. <$0.15 |
| 12 | Wan 2.5 I2V Fast | `wan-video/wan-2.5-i2v-fast` | I2V | 10s | 1080p | $0.07-$0.10 |
| 13 | Kling v1.6 Pro | `kwaivgi/kling-v1.6-pro` | T2V, I2V | 10s | 1080p | Premium |

### Extended Parameter Support Matrix

| Parameter | Veo3 | Kling2.5 | Wan2.5 | Hailuo2 | PixV4 | Seed1P | Wan2.2F | Veo3F | LTX | Mini01 | Seed1PF | Wan2.5I2V | Kling1.6 |
|-----------|:----:|:--------:|:------:|:-------:|:-----:|:------:|:-------:|:-----:|:---:|:------:|:-------:|:---------:|:--------:|
| **prompt** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **negative_prompt** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **duration** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ❌ | ✅ | ✅ | ✅ |
| **aspect_ratio** | ✅ | ✅ | ⚠️ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ❌ | ✅ |
| **resolution** | ✅ | ❌ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ❌ | ✅ | ✅ | ❌ |
| **seed** | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **image/first_frame** | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅† | ✅ |
| **last_frame/end** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **cfg_scale** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅‡ | ❌ | ❌ | ❌ | ✅ |
| **audio** | ✅§ | ❌ | ✅ | ❌ | ✅¶ | ❌ | ❌ | ✅§ | ❌ | ❌ | ❌ | ✅ | ❌ |

✅ = Fully supported | ⚠️ = Alternative parameter | ❌ = Not supported
† = Required parameter | ‡ = Named `cfg` | § = `generate_audio` | ¶ = `sound_effect_*`

### Feature Comparison Matrix

| Feature | Models Supporting |
|---------|------------------|
| **Text-to-Video** | All 13 models |
| **Image-to-Video** | Veo 3, Kling 2.5, Hailuo 2, PixVerse v4, Seedance 1 Pro, Veo 3 Fast, LTX-Video, Minimax, Seedance 1 Pro Fast, Wan 2.5 I2V, Kling v1.6 |
| **First-to-Last Frame** | PixVerse v4, Seedance 1 Pro, Hailuo 2, Kling v1.6 |
| **Audio Generation** | Veo 3, Veo 3 Fast |
| **Audio Sync** | Wan 2.5 T2V, Wan 2.5 I2V, PixVerse v4 (sound effects) |
| **Fixed Camera** | Seedance 1 Pro, Seedance 1 Pro Fast |
| **CFG Scale Control** | Kling 2.5, Kling v1.6, LTX-Video |
| **Style Presets** | PixVerse v4 (5 styles) |
| **Special Effects** | PixVerse v4 (15+ effects) |
| **LoRA Support** | Wan 2.2 Fast |
| **Reference Images** | Kling v1.6 (up to 4) |
| **Character Reference** | Minimax (subject_reference) |
| **Prompt Optimizer** | Wan 2.5 T2V, Wan 2.5 I2V, Hailuo 2, Minimax |

### Duration & Resolution Comparison

| Model | Min Duration | Max Duration | Resolutions Available | Aspect Ratios |
|-------|--------------|--------------|----------------------|---------------|
| Veo 3 | 4s | 8s | 720p, 1080p | 16:9, 9:16 |
| Kling 2.5 Turbo Pro | 5s | 10s | 1080p | 16:9, 9:16, 1:1 |
| Wan 2.5 T2V | 5s | 10s | 480p-1080p (6 options) | Via size parameter |
| Hailuo 2 | 6s | 10s | 512p, 768p, 1080p | From image |
| PixVerse v4 | 5s | 8s | 360p, 540p, 720p, 1080p | 16:9, 9:16, 1:1 |
| Seedance 1 Pro | 2s | 12s | 480p, 720p, 1080p | 7 options |
| Wan 2.2 Fast | ~5s | ~7.5s | 480p, 720p | 16:9, 9:16 |
| Veo 3 Fast | 4s | 8s | 720p, 1080p | 16:9, 9:16 |
| LTX-Video | ~4s | ~10s | 512-1024px (9 options) | 13 options |
| Minimax video-01 | ~1s | 6s | 720p | From image |
| Seedance 1 Pro Fast | 2s | 12s | 480p, 720p, 1080p | 7 options |
| Wan 2.5 I2V Fast | 5s | 10s | 720p, 1080p | From image |
| Kling v1.6 Pro | 5s | 10s | 1080p | 16:9, 9:16, 1:1 |

### Cost Comparison (Per Second)

| Tier | Models | Price Range |
|------|--------|-------------|
| **Budget** | LTX-Video, Seedance 480p, Wan 2.2 Fast | $0.03-$0.05/sec |
| **Mid-Range** | Kling 2.5, Veo 3 Fast, Wan 2.5 I2V 720p, Hailuo 2, PixVerse | $0.07-$0.10/sec |
| **Premium** | Wan 2.5 T2V, Wan 2.5 I2V 1080p, Seedance 720p-1080p | $0.10-$0.15/sec |
| **Ultra-Premium** | Veo 3 (no audio), Kling v1.6 | $0.20+/sec |
| **Premium Audio** | Veo 3 (with audio) | $0.40/sec |
| **Flat Rate** | Minimax video-01 | $0.50 per video |

### Unique Parameters by Model

| Model | Exclusive Features |
|-------|-------------------|
| **Veo 3 / Veo 3 Fast** | `generate_audio` (boolean) |
| **Kling 2.5 Turbo Pro** | `cfg_scale` (0-1) |
| **Kling v1.6 Pro** | `reference_images` (array, max 4), `end_image` |
| **Wan 2.5 T2V** | `size` (combined res/ratio), `audio` (sync file), `enable_prompt_expansion` |
| **Wan 2.5 I2V Fast** | `audio` (sync file), `enable_prompt_expansion` |
| **PixVerse v4** | `quality`, `motion_mode`, `style`, `effect`, `sound_effect_switch`, `sound_effect_content` |
| **Seedance 1 Pro / Fast** | `camera_fixed`, `fps` (fixed 24) |
| **Wan 2.2 Fast** | `num_frames`, `frames_per_second`, `go_fast`, `interpolate_output`, `optimize_prompt`, `sample_shift`, `lora_weights_*`, `lora_scale_*`, `disable_safety_checker` |
| **LTX-Video** | `image_noise_scale`, `target_size`, `cfg`, `steps`, `length` (frames), `model` (version) |
| **Minimax video-01** | `subject_reference` (character ref), `prompt_optimizer` |
| **Hailuo 2** | `prompt_optimizer` |

---

## Updated Recommendations by Use Case

### High-Quality Production
1. **Veo 3** - Best overall quality, audio generation, premium
2. **Seedance 1 Pro** - Longest duration (12s), fixed camera, 7 aspect ratios
3. **Kling 2.5 Turbo Pro** - Great prompt adherence with CFG control
4. **Hailuo 2** - High quality, first/last frame control

### Fast Iteration & Development
1. **LTX-Video** - Real-time generation, $0.03/sec
2. **Wan 2.2 Fast** - 30-second generation, $0.05/sec
3. **Seedance 1 Pro Fast** - Faster than Pro, same quality range
4. **Veo 3 Fast** - Faster than premium Veo 3

### Creative Control
1. **PixVerse v4** - 5 styles, 15+ effects, sound effects, motion modes
2. **LTX-Video** - 13 aspect ratios, frame-level control, cfg tuning
3. **Wan 2.2 Fast** - LoRA support, extensive tuning parameters
4. **Kling v1.6** - Reference images (up to 4 scene elements)

### Image Animation (I2V)
1. **Seedance 1 Pro** - First-to-last frame, longest duration (12s)
2. **Wan 2.5 I2V Fast** - Dedicated I2V, audio sync, $0.07-$0.10/sec
3. **PixVerse v4** - Last frame with effects and styles
4. **Kling v1.6** - Both start/end images, reference images
5. **Hailuo 2** - First/last frame, high quality

### Budget-Conscious
1. **LTX-Video** - $0.03/sec + real-time generation
2. **Seedance 480p** - $0.03/sec, longest duration
3. **Wan 2.2 Fast** - $0.05/sec, fastest generation
4. **Minimax** - $0.50 flat per video (6s)
5. **Seedance 1 Pro Fast** - Lower cost than Pro version

### Audio Integration
1. **Veo 3** - Native audio generation
2. **Wan 2.5 T2V / I2V** - Audio file synchronization
3. **PixVerse v4** - Sound effects and background music

### Longest Videos
1. **Seedance 1 Pro / Fast** - Up to 12 seconds
2. **Kling 2.5 / v1.6** - Up to 10 seconds
3. **Wan 2.5 T2V / I2V** - Up to 10 seconds
4. **Hailuo 2** - Up to 10 seconds

### Most Aspect Ratios
1. **LTX-Video** - 13 aspect ratios
2. **Seedance 1 Pro / Fast** - 7 aspect ratios
3. **Wan 2.5 T2V** - 6 size options

---

*Last Updated: 2025-01-15*
*Data Source: Replicate API Documentation*
*Total Models: 13*
