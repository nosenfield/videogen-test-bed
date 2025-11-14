# Best Practices for SvelteKit + TypeScript Projects

## Overview

This document outlines best practices for building modular, scalable, and maintainable applications using SvelteKit, TypeScript, and the Replicate API. These practices are derived from industry standards, framework documentation, and lessons learned from production applications.

## Table of Contents

1. Project Structure and Organization
2. TypeScript Best Practices
3. SvelteKit-Specific Patterns
4. Component Design Principles
5. State Management
6. API Integration
7. Error Handling
8. Performance Optimization
9. Testing Strategies
10. Code Quality and Maintainability
11. Security Considerations
12. Accessibility
13. Documentation Standards

---

## 1. Project Structure and Organization

### Directory Naming Conventions

**Use lowercase with hyphens for directories**:
```
src/lib/components/model-selector/
src/lib/utils/format-helpers/
```

**Avoid**:
```
src/lib/components/ModelSelector/
src/lib/utils/formatHelpers/
```

### File Naming Conventions

**Components**: PascalCase with .svelte extension
```
ModelRow.svelte
VideoPlayer.svelte
GenerationStatus.svelte
```

**TypeScript files**: camelCase with descriptive names
```
replicate.ts
formatters.ts
validationUtils.ts
```

**Test files**: Match source file name with .test.ts suffix
```
formatters.test.ts
validationUtils.test.ts
```

### Colocation Principle

Keep related files together. If a component has associated types, utilities, or tests, consider colocating them:

```
components/
├── ModelRow/
│   ├── ModelRow.svelte
│   ├── ModelRow.test.ts
│   ├── types.ts
│   └── utils.ts
```

However, for this project's scope, flat structure in component directories is acceptable.

### Import Path Aliases

Use SvelteKit's built-in `$lib` alias consistently:

```typescript
// Good
import { formatCost } from '$lib/utils/formatting';
import Button from '$lib/components/ui/Button.svelte';

// Avoid
import { formatCost } from '../../utils/formatting';
import Button from '../ui/Button.svelte';
```

### Separation of Concerns

**lib/components/**: UI components only, minimal business logic
**lib/services/**: Business logic, API calls, data transformations
**lib/stores/**: State management, no UI logic
**lib/utils/**: Pure functions, no side effects
**lib/types/**: Type definitions only, no implementation

---

## 2. TypeScript Best Practices

### Strict Type Safety

Enable strict mode in tsconfig.json:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### Interface vs Type

**Prefer interfaces for object shapes**:
```typescript
// Good - extensible
interface Model {
  id: string;
  name: string;
}

interface VideoModel extends Model {
  duration: number;
}
```

**Use type for unions, intersections, and primitives**:
```typescript
type GenerationStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'error';
type ModelId = string;
```

### Avoid Any

Never use `any`. Use `unknown` when type is truly unknown, then narrow with type guards:

```typescript
// Bad
function processData(data: any) {
  return data.value;
}

// Good
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data structure');
}
```

### Type Guards

Create type guards for runtime type checking:

```typescript
function isPrediction(obj: unknown): obj is Prediction {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'status' in obj
  );
}
```

### Utility Types

Leverage TypeScript utility types:

```typescript
// Partial for optional updates
type GenerationUpdate = Partial<Generation>;

// Pick for subset of properties
type GenerationSummary = Pick<Generation, 'id' | 'status' | 'cost'>;

// Omit to exclude properties
type GenerationInput = Omit<Generation, 'id' | 'createdAt'>;

// Record for key-value pairs
type ParameterValues = Record<string, string | number | boolean>;
```

### Readonly Where Appropriate

Use `readonly` for immutable data:

```typescript
interface Config {
  readonly apiKey: string;
  readonly maxConcurrentGenerations: number;
}

const CONSTANTS = {
  POLLING_INTERVAL: 3000,
  MAX_RETRIES: 3,
} as const;
```

### Avoid Type Assertions

Type assertions should be last resort. Prefer type guards:

```typescript
// Bad
const model = data as Model;

// Good
if (isModel(data)) {
  const model = data; // TypeScript knows it's Model
}
```

---

## 3. SvelteKit-Specific Patterns

### Component Script Organization

Structure component scripts consistently:

```svelte
<script lang="ts">
  // 1. Imports
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  
  // 2. Props
  interface Props {
    value: string;
    onChange: (value: string) => void;
  }
  
  let { value, onChange }: Props = $props();
  
  // 3. Local state
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  
  // 4. Derived state
  let isValid = $derived(value.length > 0);
  
  // 5. Functions
  function handleSubmit() {
    // implementation
  }
  
  // 6. Effects
  $effect(() => {
    console.log('Value changed:', value);
  });
  
  // 7. Lifecycle
  onMount(() => {
    // initialization
  });
</script>
```

### Reactive Declarations

Use Svelte 5 runes for reactivity:

```svelte
<script lang="ts">
  // State
  let count = $state(0);
  
  // Derived state
  let doubled = $derived(count * 2);
  
  // Effects
  $effect(() => {
    console.log(`Count is ${count}`);
  });
</script>
```

### Props Destructuring

Use Svelte 5 props rune with TypeScript:

```svelte
<script lang="ts">
  interface Props {
    title: string;
    optional?: boolean;
  }
  
  let { title, optional = false }: Props = $props();
</script>
```

### Event Handling

Prefer inline arrow functions for simple handlers, named functions for complex logic:

```svelte
<!-- Simple inline -->
<button onclick={() => count++}>Increment</button>

<!-- Complex logic - use named function -->
<button onclick={handleComplexOperation}>Process</button>

<script lang="ts">
  function handleComplexOperation() {
    // multiple lines of logic
  }
</script>
```

### Conditional Rendering

Use `{#if}` blocks for conditional rendering:

```svelte
{#if isLoading}
  <LoadingSpinner />
{:else if error}
  <ErrorDisplay message={error} />
{:else}
  <Content data={data} />
{/if}
```

### List Rendering

Always use keyed `{#each}` blocks:

```svelte
{#each items as item (item.id)}
  <Item data={item} />
{/each}
```

### Store Subscriptions

Use `$` prefix for automatic store subscriptions:

```svelte
<script lang="ts">
  import { generations } from '$lib/stores/generations';
  
  // Automatic subscription and cleanup
  const items = $generations.items;
</script>
```

For manual subscriptions, always unsubscribe:

```svelte
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { generations } from '$lib/stores/generations';
  
  let items = [];
  const unsubscribe = generations.subscribe(value => {
    items = value.items;
  });
  
  onDestroy(unsubscribe);
</script>
```

---

## 4. Component Design Principles

### Single Responsibility

Each component should do one thing well:

```svelte
<!-- Good - focused component -->
<VideoPlayer url={videoUrl} />

<!-- Bad - component doing too much -->
<VideoPlayerWithStatusAndCostAndMetadata ... />
```

### Props Over Store Access

Components should receive data via props when possible:

```svelte
<!-- Good -->
<ModelRow 
  generation={generation} 
  onUpdate={handleUpdate} 
/>

<!-- Avoid - tight coupling to store -->
<ModelRow generationId={id} />
<!-- Component internally accesses store -->
```

### Controlled vs Uncontrolled

Prefer controlled components for form inputs:

```svelte
<!-- Controlled - parent manages state -->
<Input 
  value={inputValue} 
  onChange={(v) => inputValue = v} 
/>

<!-- Uncontrolled - component manages own state -->
<Input bind:value={internalState} />
```

Use controlled for app state, uncontrolled for isolated UI state.

### Composition Over Inheritance

Build complex components from simple ones:

```svelte
<!-- ModelRow.svelte -->
<div class="model-row">
  <ModelSelector {modelId} {onChange} />
  <ParameterForm {parameters} {onChange} />
  <GenerationStatus {status} />
  <VideoPlayer {videoUrl} />
</div>
```

### Prop Validation

Validate props early:

```svelte
<script lang="ts">
  interface Props {
    value: string;
  }
  
  let { value }: Props = $props();
  
  $effect(() => {
    if (!value) {
      console.warn('Value prop is required');
    }
  });
</script>
```

### Default Props

Provide sensible defaults:

```svelte
<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
  }
  
  let { 
    size = 'md',
    disabled = false 
  }: Props = $props();
</script>
```

### Callback Props

Type callback props properly:

```svelte
<script lang="ts">
  interface Props {
    onChange: (value: string) => void;
    onError?: (error: Error) => void;
  }
  
  let { onChange, onError }: Props = $props();
</script>
```

---

## 5. State Management

### Store Organization

One store per domain:

```typescript
// generations.ts - manages generation lifecycle
export const generations = writable<GenerationsState>({
  items: [],
  activeCount: 0,
});

// models.ts - manages available models
export const models = writable<Model[]>([]);

// ui.ts - manages UI state
export const ui = writable<UIState>({
  isLoading: false,
  error: null,
});
```

### Immutable Updates

Always return new objects, never mutate:

```typescript
// Bad
export function updateGeneration(id: string, updates: Partial<Generation>) {
  generations.update(state => {
    const item = state.items.find(g => g.id === id);
    if (item) {
      Object.assign(item, updates); // Mutation!
    }
    return state;
  });
}

// Good
export function updateGeneration(id: string, updates: Partial<Generation>) {
  generations.update(state => ({
    ...state,
    items: state.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ),
  }));
}
```

### Derived Stores

Use derived stores for computed values:

```typescript
import { derived } from 'svelte/store';
import { generations } from './generations';

export const activeGenerations = derived(
  generations,
  $generations => $generations.items.filter(g => g.status === 'processing')
);

export const totalCost = derived(
  generations,
  $generations => $generations.items.reduce((sum, g) => sum + (g.cost || 0), 0)
);
```

### Store Actions

Export functions to modify stores:

```typescript
export function addGeneration(generation: Generation) {
  generations.update(state => ({
    ...state,
    items: [...state.items, generation],
    activeCount: state.activeCount + 1,
  }));
}

export function removeGeneration(id: string) {
  generations.update(state => ({
    ...state,
    items: state.items.filter(g => g.id !== id),
    activeCount: Math.max(0, state.activeCount - 1),
  }));
}
```

### Local vs Global State

**Use stores for**:
- Shared state across components
- State that persists across navigation
- Complex state logic

**Use local state for**:
- UI-only state (hover, focus)
- Form input values (unless shared)
- Component-specific toggles

---

## 6. API Integration

### Service Layer Pattern

Keep API calls in service modules:

```typescript
// services/replicate.ts
export async function generateVideo(
  modelId: string,
  parameters: Record<string, any>
): Promise<Prediction> {
  try {
    const prediction = await replicate.predictions.create({
      version: modelId,
      input: parameters,
    });
    return prediction;
  } catch (error) {
    throw new APIError('Failed to generate video', error);
  }
}
```

### Error Handling

Create custom error classes:

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public originalError: unknown,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

Use try-catch consistently:

```typescript
async function handleGeneration() {
  try {
    const result = await generateVideo(modelId, params);
    // handle success
  } catch (error) {
    if (error instanceof APIError) {
      // handle API error
    } else if (error instanceof ValidationError) {
      // handle validation error
    } else {
      // handle unknown error
    }
  }
}
```

### Request Cancellation

Support request cancellation:

```typescript
let abortController: AbortController | null = null;

async function fetchData() {
  abortController = new AbortController();
  
  try {
    const response = await fetch(url, {
      signal: abortController.signal,
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request cancelled');
    }
    throw error;
  }
}

function cancelRequest() {
  abortController?.abort();
}
```

### Retry Logic

Implement exponential backoff for retries:

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}
```

### Response Validation

Validate API responses:

```typescript
function validatePrediction(data: unknown): Prediction {
  if (!isPrediction(data)) {
    throw new ValidationError('Invalid prediction response', 'prediction');
  }
  return data;
}

async function getGenerationStatus(id: string): Promise<Prediction> {
  const response = await fetch(`/api/predictions/${id}`);
  const data = await response.json();
  return validatePrediction(data);
}
```

---

## 7. Error Handling

### Error Boundaries

Create error boundary pattern for components:

```svelte
<!-- ErrorBoundary.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  let error = $state<Error | null>(null);
  
  onMount(() => {
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  });
  
  function handleError(event: ErrorEvent) {
    error = event.error;
  }
</script>

{#if error}
  <ErrorDisplay error={error} />
{:else}
  <slot />
{/if}
```

### User-Friendly Messages

Transform technical errors to user-friendly messages:

```typescript
export function getUserMessage(error: unknown): string {
  if (error instanceof APIError) {
    switch (error.code) {
      case 'RATE_LIMIT':
        return 'Too many requests. Please wait a moment and try again.';
      case 'INVALID_API_KEY':
        return 'API key is invalid. Please check your configuration.';
      default:
        return 'Failed to connect to the service. Please try again.';
    }
  }
  
  if (error instanceof ValidationError) {
    return `Invalid ${error.field}: ${error.message}`;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
```

### Error Logging

Log errors appropriately:

```typescript
export function logError(error: Error, context?: Record<string, any>) {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
  
  // In production, send to error tracking service
  // sendToErrorTracking(error, context);
}
```

### Graceful Degradation

Handle missing features gracefully:

```svelte
<script lang="ts">
  let videoSupported = $state(true);
  
  onMount(() => {
    videoSupported = 'HTMLVideoElement' in window;
  });
</script>

{#if videoSupported}
  <video src={url} />
{:else}
  <div>
    Video playback not supported.
    <a href={url} download>Download video</a>
  </div>
{/if}
```

---

## 8. Performance Optimization

### Lazy Loading

Lazy load components when appropriate:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let VideoPlayer;
  
  onMount(async () => {
    const module = await import('$lib/components/ui/VideoPlayer.svelte');
    VideoPlayer = module.default;
  });
</script>

{#if VideoPlayer}
  <svelte:component this={VideoPlayer} {videoUrl} />
{/if}
```

### Debouncing

Debounce expensive operations:

```typescript
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

Usage:
```svelte
<script lang="ts">
  import { debounce } from '$lib/utils/performance';
  
  const debouncedSearch = debounce((query: string) => {
    performSearch(query);
  }, 300);
</script>

<input oninput={(e) => debouncedSearch(e.currentTarget.value)} />
```

### Memoization

Memoize expensive computations:

```typescript
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
```

### Avoid Unnecessary Reactivity

Be mindful of reactive statements:

```svelte
<script lang="ts">
  // Bad - runs on every render
  $effect(() => {
    expensiveComputation();
  });
  
  // Good - runs only when dependency changes
  $effect(() => {
    expensiveComputation(specificValue);
  });
</script>
```

### Virtual Scrolling

For long lists, consider virtual scrolling:

```svelte
<!-- For lists with 100+ items -->
{#each visibleItems as item (item.id)}
  <Item data={item} />
{/each}
```

---

## 9. Testing Strategies

### Unit Test Structure

Follow Arrange-Act-Assert pattern:

```typescript
import { describe, it, expect } from 'vitest';
import { formatCost } from './formatting';

describe('formatCost', () => {
  it('formats cost with two decimal places', () => {
    // Arrange
    const cost = 1.5;
    
    // Act
    const result = formatCost(cost);
    
    // Assert
    expect(result).toBe('$1.50');
  });
  
  it('handles zero cost', () => {
    expect(formatCost(0)).toBe('$0.00');
  });
  
  it('handles null cost', () => {
    expect(formatCost(null)).toBe('N/A');
  });
});
```

### Component Testing

Test component behavior, not implementation:

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import Button from './Button.svelte';

it('calls onClick when clicked', async () => {
  const mockClick = vi.fn();
  const { getByText } = render(Button, {
    props: { label: 'Click me', onClick: mockClick }
  });
  
  const button = getByText('Click me');
  await fireEvent.click(button);
  
  expect(mockClick).toHaveBeenCalledTimes(1);
});
```

### Mock API Calls

Mock external dependencies:

```typescript
import { vi } from 'vitest';
import { generateVideo } from './replicate';

vi.mock('./replicate', () => ({
  generateVideo: vi.fn()
}));

it('handles generation success', async () => {
  const mockPrediction = { id: '123', status: 'succeeded' };
  vi.mocked(generateVideo).mockResolvedValue(mockPrediction);
  
  const result = await generateVideo('model-id', {});
  expect(result).toEqual(mockPrediction);
});
```

### Test Coverage

Aim for high coverage in critical paths:
- Utility functions: 90%+ coverage
- Store logic: 85%+ coverage
- Components: 70%+ coverage
- Integration tests for critical workflows

---

## 10. Code Quality and Maintainability

### DRY Principle

Don't Repeat Yourself - extract common logic:

```typescript
// Bad - repeated logic
function formatDollars(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function formatEuros(amount: number) {
  return `€${amount.toFixed(2)}`;
}

// Good - single function with parameter
function formatCurrency(amount: number, symbol: string = '$') {
  return `${symbol}${amount.toFixed(2)}`;
}
```

### KISS Principle

Keep It Simple, Stupid - prefer simple solutions:

```typescript
// Overly complex
function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
}

// Simple and sufficient for MVP
function isValidEmail(email: string): boolean {
  return email.includes('@') && email.includes('.');
}
```

### Magic Numbers

Avoid magic numbers, use named constants:

```typescript
// Bad
if (items.length > 5) {
  showWarning();
}

// Good
const MAX_CONCURRENT_GENERATIONS = 5;
if (items.length > MAX_CONCURRENT_GENERATIONS) {
  showWarning();
}
```

### Function Length

Keep functions focused and short:

```typescript
// Prefer this - single purpose
function validateAndSubmit(data: FormData) {
  const errors = validate(data);
  if (errors.length > 0) {
    showErrors(errors);
    return;
  }
  submit(data);
}

// Over this - doing too much
function handleFormSubmit(data: FormData) {
  // 50+ lines of validation, submission, error handling...
}
```

### Comments

Write self-documenting code, use comments for why, not what:

```typescript
// Bad comment - describes what code does
// Multiply price by 1.1
const total = price * 1.1;

// Good comment - explains why
// Apply 10% service fee
const total = price * SERVICE_FEE_MULTIPLIER;

// Good comment - explains complex business logic
// Polling interval increases exponentially to reduce server load
// while allowing quick updates initially
const pollInterval = BASE_INTERVAL * Math.pow(2, attemptCount);
```

### Code Reviews

Self-review checklist before committing:
- TypeScript errors resolved
- Tests pass
- No console.log statements
- Error handling in place
- Documentation updated
- Performance considered
- Accessibility checked

---

## 11. Security Considerations

### Environment Variables

Never commit secrets:

```typescript
// Bad
const API_KEY = 'sk-1234567890abcdef';

// Good
const API_KEY = import.meta.env.VITE_REPLICATE_API_KEY;
```

Always validate environment variables:

```typescript
export function getApiKey(): string {
  const key = import.meta.env.VITE_REPLICATE_API_KEY;
  if (!key) {
    throw new Error('VITE_REPLICATE_API_KEY is not set');
  }
  return key;
}
```

### Input Validation

Validate and sanitize all user inputs:

```typescript
export function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .slice(0, MAX_PROMPT_LENGTH)
    .replace(/[<>]/g, ''); // Remove potential HTML
}
```

### XSS Prevention

Svelte automatically escapes HTML, but be careful with @html:

```svelte
<!-- Dangerous - never do this with user input -->
{@html userGeneratedContent}

<!-- Safe - Svelte escapes by default -->
{userGeneratedContent}
```

### HTTPS Only

Ensure all external resources use HTTPS:

```typescript
function validateUrl(url: string): boolean {
  return url.startsWith('https://');
}
```

---

## 12. Accessibility

### Semantic HTML

Use appropriate HTML elements:

```svelte
<!-- Good -->
<button onclick={handleClick}>Generate</button>

<!-- Bad -->
<div onclick={handleClick}>Generate</div>
```

### ARIA Labels

Add labels for screen readers:

```svelte
<button 
  onclick={handleGenerate}
  aria-label="Generate video with selected model"
>
  Generate
</button>

<input
  type="text"
  aria-label="Video generation prompt"
  aria-describedby="prompt-help"
/>
<span id="prompt-help">Enter a description of the video you want to generate</span>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```svelte
<div
  role="button"
  tabindex="0"
  onclick={handleClick}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Interactive element
</div>
```

### Focus Management

Manage focus for better UX:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let inputRef: HTMLInputElement;
  
  onMount(() => {
    inputRef?.focus();
  });
</script>

<input bind:this={inputRef} />
```

### Color Contrast

Ensure sufficient contrast ratios:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Use Tailwind's contrast utilities

### Alt Text

Always provide alt text for images:

```svelte
<img 
  src={thumbnailUrl} 
  alt="Generated video thumbnail showing {description}"
/>
```

---

## 13. Documentation Standards

### JSDoc Comments

Document all public functions:

```typescript
/**
 * Formats a cost value as a currency string.
 * 
 * @param cost - The cost value to format (can be null)
 * @param currency - The currency symbol (default: '$')
 * @returns Formatted currency string or 'N/A' if cost is null
 * 
 * @example
 * formatCost(1.5) // Returns '$1.50'
 * formatCost(null) // Returns 'N/A'
 */
export function formatCost(
  cost: number | null,
  currency: string = '$'
): string {
  if (cost === null) return 'N/A';
  return `${currency}${cost.toFixed(2)}`;
}
```

### Component Documentation

Document component props and usage:

```svelte
<!--
  ModelSelector Component
  
  Dropdown for selecting a video generation model.
  
  Props:
  - value: string - Currently selected model ID
  - models: Model[] - Array of available models
  - onChange: (modelId: string) => void - Callback when selection changes
  
  Usage:
  <ModelSelector 
    value={selectedModel}
    models={availableModels}
    onChange={handleModelChange}
  />
-->
<script lang="ts">
  // Implementation
</script>
```

### README Sections

Include in README.md:
- Project overview
- Installation instructions
- Environment setup
- Usage examples
- API documentation
- Contributing guidelines
- License

### Inline Comments

Use inline comments for complex logic:

```typescript
// Use exponential backoff to avoid overwhelming the API
// Base interval doubles with each retry attempt
const delay = BASE_INTERVAL * Math.pow(2, retryCount);
```

### Type Documentation

Document complex types:

```typescript
/**
 * Represents a video generation request in progress.
 * 
 * Status lifecycle:
 * idle -> queued -> processing -> completed | error
 */
interface Generation {
  /** Unique identifier for this generation */
  id: string;
  
  /** ID of the model being used (format: owner/name:version) */
  modelId: string;
  
  /** Current status of the generation */
  status: GenerationStatus;
  
  /** Timestamp when generation started (milliseconds) */
  startTime: number | null;
}
```

---

## Summary Checklist

Before considering any code complete, verify:

- [ ] TypeScript strict mode passes with no errors
- [ ] All functions have JSDoc comments
- [ ] No `any` types used
- [ ] Error handling implemented
- [ ] Loading states shown to users
- [ ] Keyboard navigation works
- [ ] ARIA labels present where needed
- [ ] No console.log statements
- [ ] Tests written and passing
- [ ] Component is reusable and focused
- [ ] Props are properly typed
- [ ] Store updates are immutable
- [ ] API calls have error handling
- [ ] User-facing errors are friendly
- [ ] Performance considerations addressed
- [ ] Security best practices followed
- [ ] Code reviewed (self or peer)
- [ ] Documentation updated
- [ ] Accessibility verified

---

## Additional Resources

For more detailed information, consult:
- SvelteKit documentation: https://svelte.dev/docs/kit
- TypeScript handbook: https://www.typescriptlang.org/docs/
- Replicate API docs: https://replicate.com/docs
- See required-reading.md for comprehensive learning resources
