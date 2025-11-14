# Error Handling

Reference: [best-practices.md](../best-practices.md) | Related: [06-api-integration.md](./06-api-integration.md), [10-code-quality.md](./10-code-quality.md)

---

## Error Boundaries

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

---

## User-Friendly Messages

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

---

## Error Logging

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

---

## Graceful Degradation

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

**Cross-References:**
- API error classes: See [06-api-integration.md](./06-api-integration.md#error-handling)
- Error display components: See [04-component-design.md](./04-component-design.md)
- Logging in production: See [10-code-quality.md](./10-code-quality.md#comments)
