# State Management

Reference: [best-practices.md](../best-practices.md) | Related: [03-sveltekit-patterns.md](./03-sveltekit-patterns.md), [04-component-design.md](./04-component-design.md)

---

## Store Organization

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

---

## Immutable Updates

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

---

## Derived Stores

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

---

## Store Actions

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

---

## Local vs Global State

**Use stores for**:
- Shared state across components
- State that persists across navigation
- Complex state logic

**Use local state for**:
- UI-only state (hover, focus)
- Form input values (unless shared)
- Component-specific toggles

---

**Cross-References:**
- Store subscriptions in components: See [03-sveltekit-patterns.md](./03-sveltekit-patterns.md#store-subscriptions)
- Props vs store access: See [04-component-design.md](./04-component-design.md#props-over-store-access)
- Store testing: See [09-testing.md](./09-testing.md#mock-api-calls)
