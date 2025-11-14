# SvelteKit-Specific Patterns

Reference: [best-practices.md](../best-practices.md) | Related: [04-component-design.md](./04-component-design.md), [05-state-management.md](./05-state-management.md)

---

## Component Script Organization

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

---

## Reactive Declarations

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

---

## Props Destructuring

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

---

## Event Handling

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

---

## Conditional Rendering

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

---

## List Rendering

Always use keyed `{#each}` blocks:

```svelte
{#each items as item (item.id)}
  <Item data={item} />
{/each}
```

---

## Store Subscriptions

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

**Cross-References:**
- Component design principles: See [04-component-design.md](./04-component-design.md)
- Store patterns: See [05-state-management.md](./05-state-management.md)
- Error display components: See [07-error-handling.md](./07-error-handling.md#error-boundaries)
