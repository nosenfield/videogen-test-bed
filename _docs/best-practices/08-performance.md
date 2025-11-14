# Performance Optimization

Reference: [best-practices.md](../best-practices.md) | Related: [03-sveltekit-patterns.md](./03-sveltekit-patterns.md), [05-state-management.md](./05-state-management.md)

---

## Lazy Loading

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

---

## Debouncing

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

---

## Memoization

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

---

## Avoid Unnecessary Reactivity

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

---

## Virtual Scrolling

For long lists, consider virtual scrolling:

```svelte
<!-- For lists with 100+ items -->
{#each visibleItems as item (item.id)}
  <Item data={item} />
{/each}
```

---

**Cross-References:**
- Derived stores for computed values: See [05-state-management.md](./05-state-management.md#derived-stores)
- Reactive declarations: See [03-sveltekit-patterns.md](./03-sveltekit-patterns.md#reactive-declarations)
- Performance testing: See [09-testing.md](./09-testing.md)
