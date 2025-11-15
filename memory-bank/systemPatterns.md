# System Patterns: AI Video Generation Pipeline

**Last Updated**: November 14, 2024

## Architecture Overview

### System Design
The pipeline follows a five-stage architecture for transforming prompts into complete videos:

```
┌──────────────┐     ┌─────────────────┐     ┌────────────────┐
│Prompt Parser │────▶│Content Planner  │────▶│Generation Engine│
└──────────────┘     └─────────────────┘     └────────────────┘
                                                      │
                     ┌─────────────────┐     ┌───────▼──────────┐
                     │Output Handler   │◀────│Composition Layer │
                     └─────────────────┘     └──────────────────┘
                              │
                     ┌────────▼─────────┐
                     │  Final Video MP4  │
                     └───────────────────┘
```

1. **Prompt Parser**: Extracts creative direction, style preferences, timing requirements
2. **Content Planner**: Breaks video into scenes/segments, determines clip durations and transitions
3. **Generation Engine**: Calls Replicate API for video/image/audio generation per scene
4. **Composition Layer**: Stitches clips together with audio-visual sync and transitions
5. **Output Handler**: Renders final video in standard format with proper compression

### Module Structure (SvelteKit Exploration Phase)
```
video-pipeline-exploration/
├── _docs/                      # Project documentation
│   ├── architecture.md         # System architecture
│   ├── prd.md                 # Product requirements
│   └── task-list/             # 13 chunked task files
├── memory-bank/                # Session context
├── src/
│   ├── lib/
│   │   ├── components/        # Svelte UI components
│   │   │   ├── ui/            # Base components
│   │   │   └── [features]/    # Feature components
│   │   ├── services/          # API integration
│   │   │   ├── replicate.ts   # Replicate API client
│   │   │   └── models.ts      # Model configurations
│   │   ├── stores/            # State management
│   │   ├── types/             # TypeScript definitions
│   │   └── utils/             # Utilities and constants
│   └── routes/                # SvelteKit pages
└── static/                    # Static assets
```

---

## Design Patterns

### Pattern 1: Pipeline Stage Pattern
**When to use**: For breaking down complex video generation into discrete, testable stages
**Implementation**:
```typescript
interface PipelineStage<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
  validate(input: TInput): ValidationResult;
  retry(input: TInput, attempt: number): Promise<TOutput>;
}

// Each stage is independent and composable
class PromptParsingStage implements PipelineStage<string, ParsedPrompt> { }
class ContentPlanningStage implements PipelineStage<ParsedPrompt, ScenePlan> { }
class GenerationStage implements PipelineStage<ScenePlan, GeneratedClips> { }
```

### Pattern 2: Model Configuration Pattern
**When to use**: For managing multiple Replicate models with different capabilities and costs
**Implementation**:
```typescript
interface ModelConfig {
  id: string;
  capabilities: ModelCapabilities;
  pricing: PricingInfo;
  parameters: ParameterSchema[];
}

// Centralized model registry
const MODELS: ModelConfig[] = [
  { id: 'kling-2.5-turbo', capabilities: { ... }, ... },
  { id: 'veo-3.1', capabilities: { ... }, ... }
];

// Selection based on requirements and budget
function selectModel(requirements: Requirements): ModelConfig
```

### Pattern 3: Caching & Deduplication Pattern
**When to use**: To avoid redundant API calls and reduce costs
**Implementation**:
- Cache generated clips by prompt hash + model + parameters
- Reuse clips across multiple videos with similar scenes
- Store model schemas to avoid repeated fetches

### Pattern 4: Uncontrolled Component Pattern (Svelte)
**When to use**: For complex form components where parent doesn't need to manage every keystroke, or when circular parent-child updates would cause infinite loops
**Implementation**:
```typescript
// Component manages its own state after initial props
let localParams = $state<Record<string, any>>({});

// Initialize from props only on first mount
$effect(() => {
  if (!isInitialized && parameters) {
    localParams = { ...parameters };
    isInitialized = true;
  }
});

// Parent receives updates via callback
function handleChange(value: any) {
  localParams = { ...localParams, ...value };
  onChange(localParams); // Notify parent
}
```
**Key characteristics**:
- Component owns its state after initialization
- Parent provides initial values via props (first mount only)
- Parent receives updates via `onChange` callback
- Parent should NOT update props after mount (changes are ignored)
- Component re-initializes only when key prop changes (e.g., `modelId`)
- Prevents infinite loops from circular parent-child updates
**Used in**: ParameterForm component (COMP-002)

### Pattern 5: Consolidated State Derivation Pattern (Svelte 5)
**When to use**: When multiple derived values depend on the same source data, or when derived values depend on other derived values
**Implementation**:
```typescript
// Instead of multiple derived values creating chains:
let generation = $derived($generationsStore.items.find(g => g.id === id));
let displayStatus = $derived(generation?.status || "idle");
let isActive = $derived(displayStatus === "queued" || displayStatus === "processing");
let isComplete = $derived(displayStatus === "completed");
let hasError = $derived(displayStatus === "error");

// Use consolidated derivation:
let generationState = $derived.by(() => {
  const gen = $generationsStore.items.find(g => g.id === id);
  const status = gen?.status || "idle";
  return {
    generation: gen || null,
    status,
    isActive: status === "queued" || status === "processing",
    isComplete: status === "completed",
    hasError: status === "error"
  };
});
```
**Key characteristics**:
- Single `$derived.by()` computes all related state at once
- Avoids unnecessary derivation chains
- More efficient (one computation instead of multiple)
- Clearer code organization
- Direct store subscriptions with `$` prefix (never wrap derived stores in `$derived()`)
**Used in**: ModelRow component (COMP-006)

### Pattern 6: Component Orchestration Pattern
**When to use**: When a parent component needs to coordinate multiple child components and manage complex workflows
**Implementation**:
```typescript
// Orchestrator component manages workflow and coordinates children
// - Subscribes to stores for persistence
// - Manages local UI state
// - Coordinates between child components
// - Handles complete lifecycle (input → processing → output)
let selectedModelId = $state<string>("");
let parameters = $state<Record<string, any>>({});
let generationState = $derived.by(() => {
  // Consolidated state from store
});

// Render child components conditionally based on state
{#if selectedModelId}
  <ModelSelector value={selectedModelId} onChange={handleModelChange} />
  <ParameterForm modelId={selectedModelId} parameters={parameters} onChange={handleParametersChange} />
  <CostEstimator modelId={selectedModelId} parameters={parameters} />
{/if}
```
**Key characteristics**:
- Parent manages workflow state and lifecycle
- Children are focused on specific responsibilities
- Store subscriptions for persistence
- Local state for UI interactions
- Conditional rendering based on workflow stage
**Used in**: ModelRow component (COMP-006)

---

## Key Invariants

### Invariant 1: Visual Coherence
All clips in a single video must share consistent style parameters (color palette, art style, aspect ratio). The prompt parser extracts global style directives that apply to all scenes.

### Invariant 2: Audio-Visual Synchronization
Scene transitions must align with audio timing markers (beats for music, voiceover pauses for ads). The content planner determines clip durations based on audio analysis.

### Invariant 3: Cost Tracking
Every API call must log its cost. Total generation cost must be tracked and reported. Generation must fail gracefully if budget limit is exceeded.

---

## Data Flow

### Video Generation Flow
1. User submits prompt + optional audio file
2. Prompt Parser extracts: style, mood, scenes, timing requirements
3. Content Planner creates ScenePlan with clip durations and transitions
4. Generation Engine processes scenes sequentially or in parallel:
   - Calls Replicate API for each scene
   - Polls for completion
   - Stores generated clips
5. Composition Layer stitches clips:
   - Applies transitions aligned with audio
   - Adds audio track
   - Renders final video
6. Output Handler compresses and delivers final MP4

### State Management (SvelteKit Phase)
- **Svelte Stores**: Manage generation state, model configurations, UI state
- **Writable Stores**: Mutable state for generations, parameters
- **Derived Stores**: Computed values (active generation count, session cost)
- **Direct Store Subscriptions**: Use `$storeName` prefix for automatic reactivity in Svelte 5
- **Consolidated State Derivation**: Use `$derived.by()` for related state to avoid derivation chains
- **Never Double-Derive**: Don't wrap derived stores in `$derived()` - access them directly with `$` prefix

---

## Integration Points

### Replicate API
- **Purpose**: AI model inference for video, image, and audio generation
- **How we use it**:
  - Call predictions API with model ID and parameters
  - Poll for completion status
  - Retrieve generated outputs
- **Failure handling**:
  - Retry with exponential backoff (max 3 attempts)
  - Fall back to alternate models if available
  - Log failures and report to user
  - Graceful degradation (partial video with fewer clips)

### FFmpeg / Video Composition
- **Purpose**: Stitch clips, add transitions, sync audio, render final video
- **How we use it**:
  - Concatenate clips with fade transitions
  - Overlay audio track
  - Apply filters for consistency
  - Export as MP4 with h264 codec
- **Failure handling**:
  - Validate clip formats before composition
  - Retry with different encoding settings
  - Fall back to simpler composition if complex fails

### Audio Analysis Library (Music Videos)
- **Purpose**: Beat detection, tempo analysis, song structure identification
- **How we use it**:
  - Extract beat timestamps
  - Identify song sections (intro, verse, chorus)
  - Determine scene transition points
- **Failure handling**:
  - Use default timing if analysis fails
  - Allow manual timing overrides

---

## Performance Considerations

### Optimization Strategy
- **Start cheap, upgrade selectively**: Use lower-cost models for iteration, premium models for final outputs
- **Parallel generation**: Generate independent scenes concurrently where possible
- **Progressive rendering**: Show previews as clips complete
- **Smart caching**: Avoid re-generating identical scenes

### Caching Strategy
- **Model schemas**: Cache API schemas to avoid repeated metadata fetches
- **Generated clips**: Cache by content hash (prompt + parameters)
- **Audio analysis**: Cache beat detection results for uploaded songs
- **Parameter presets**: Cache common style/parameter combinations

### Scaling Approach
- **MVP**: Single-user, sequential processing
- **Future**:
  - Queue system for concurrent requests
  - Worker pool for parallel scene generation
  - CDN for output video delivery
  - Background job processing for long videos
