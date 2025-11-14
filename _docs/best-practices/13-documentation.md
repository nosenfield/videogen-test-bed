# Documentation Standards

Reference: [best-practices.md](../best-practices.md) | Related: [02-typescript.md](./02-typescript.md), [10-code-quality.md](./10-code-quality.md)

---

## JSDoc Comments

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

---

## Component Documentation

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

---

## README Sections

Include in README.md:
- Project overview
- Installation instructions
- Environment setup
- Usage examples
- API documentation
- Contributing guidelines
- License

---

## Inline Comments

Use inline comments for complex logic:

```typescript
// Use exponential backoff to avoid overwhelming the API
// Base interval doubles with each retry attempt
const delay = BASE_INTERVAL * Math.pow(2, retryCount);
```

---

## Type Documentation

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

**Cross-References:**
- TypeScript interfaces: See [02-typescript.md](./02-typescript.md#interface-vs-type)
- Comment best practices: See [10-code-quality.md](./10-code-quality.md#comments)
- Component design: See [04-component-design.md](./04-component-design.md)
