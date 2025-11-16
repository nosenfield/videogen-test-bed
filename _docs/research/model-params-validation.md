# Model Parameters Validation Report

**Date**: 2025-01-15  
**Validation Method**: Replicate API Direct Query  
**Purpose**: Validate character/subject image reference support across video generation models

---

## Executive Summary

**Models Supporting Character/Subject Image References:**

1. ✅ **Minimax video-01** (`minimax/video-01`)
   - Parameter: `subject_reference` (single URI)
   - Description: "An optional character reference image to use as the subject in the generated video (this will use the S2V-01 model)"
   - **Status**: ✅ Documented correctly in model-params.md

2. ✅ **Kling v1.6 Pro** (`kwaivgi/kling-v1.6-pro`)
   - Parameter: `reference_images` (array of URIs, max 4)
   - Description: "Reference images to use in video generation (up to 4 images). Also known as scene elements."
   - **Status**: ✅ Documented correctly in model-params.md

3. ✅ **Google Veo 3.1** (`google/veo-3.1`) - **NEW MODEL NOT IN DOCUMENTATION**
   - Parameter: `reference_images` (array of URIs, 1-3 images)
   - Description: "1 to 3 reference images for subject-consistent generation (reference-to-video, or R2V). Reference images only work with 16:9 aspect ratio and 8-second duration. Last frame is ignored if reference images are provided."
   - **Status**: ❌ **NOT DOCUMENTED** - This is a newer model not included in model-params.md

---

## Detailed Findings

### Character/Subject Reference Support

| Model | Parameter Name | Type | Max Images | Constraints | Documented? |
|-------|----------------|------|------------|-------------|-------------|
| **Minimax video-01** | `subject_reference` | URI | 1 | Uses S2V-01 model | ✅ Yes |
| **Kling v1.6 Pro** | `reference_images` | Array[URI] | 4 | Scene elements | ✅ Yes |
| **Google Veo 3.1** | `reference_images` | Array[URI] | 3 | 16:9 only, 8s duration only | ❌ No |

### Models Checked Without Character Reference Support

The following models were validated and **do NOT** support character/subject image references (they only support first/last frame images):

- ❌ Google Veo 3 (`google/veo-3`) - Only `image` (first frame)
- ❌ Google Veo 3 Fast (`google/veo-3-fast`) - Only `image` (first frame)
- ❌ Google Veo 3.1 Fast (`google/veo-3.1-fast`) - Only `image` (first frame), no reference_images
- ❌ Kling 2.5 Turbo Pro (`kwaivgi/kling-v2.5-turbo-pro`) - Only `start_image` (first frame)
- ❌ PixVerse v4 (`pixverse/pixverse-v4`) - Only `image` (first frame) and `last_frame_image`
- ❌ Luma Ray (`luma/ray`) - Only `start_image` and `end_image`
- ❌ Minimax video-01-live (`minimax/video-01-live`) - Only `first_frame_image`
- ❌ Minimax video-01-director (`minimax/video-01-director`) - Only `first_frame_image`

---

## Key Differences: Character Reference vs. First Frame

**Important Distinction:**

- **First Frame Image** (`image`, `start_image`, `first_frame_image`): Sets the starting frame of the video. The model generates motion from this frame.
- **Character/Subject Reference** (`subject_reference`, `reference_images`): Provides reference images of a character/subject that should appear consistently throughout the video, but the model generates the scene and motion around/with that character.

### Example Use Cases:

**First Frame (Image-to-Video):**
- "Animate this photo of a cat"
- "Make this landscape image come alive"

**Character Reference (Reference-to-Video):**
- "Generate a video of this character walking through a forest"
- "Create a video with this person in different scenes"
- "Make a video featuring this character in various poses"

---

## Recommendations

### For model-params.md Updates:

1. **Add Google Veo 3.1** as a new model entry:
   - Includes `reference_images` parameter (1-3 images)
   - Supports reference-to-video (R2V) generation
   - Constraints: 16:9 aspect ratio, 8-second duration only
   - Last frame parameter is ignored when using reference images

2. **Clarify terminology** in model-params.md:
   - Distinguish between "first frame" (I2V) and "character reference" (R2V)
   - Add a section explaining the difference

3. **Update comparison matrix** to include:
   - Character/subject reference support column
   - Google Veo 3.1 in the model list

---

## Validation Methodology

1. Searched Replicate API for video generation models
2. Retrieved OpenAPI schemas for models with potential character reference support
3. Examined input parameter definitions
4. Cross-referenced with model-params.md documentation
5. Identified discrepancies and new models

---

## Conclusion

**Total Models Supporting Character/Subject References: 3**

1. ✅ Minimax video-01 - `subject_reference` (1 image)
2. ✅ Kling v1.6 Pro - `reference_images` (up to 4 images)
3. ✅ Google Veo 3.1 - `reference_images` (1-3 images) - **NEW, NOT DOCUMENTED**

The model-params.md document correctly documents the first two models but is missing Google Veo 3.1, which is a newer model with reference-to-video capabilities.

