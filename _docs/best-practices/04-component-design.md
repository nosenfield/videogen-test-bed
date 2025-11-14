# Component Design Principles

Reference: [best-practices.md](../best-practices.md) | Related: [03-sveltekit-patterns.md](./03-sveltekit-patterns.md), [05-state-management.md](./05-state-management.md)

---

## Single Responsibility

Each component should do one thing well:

```svelte
<!-- Good - focused component -->
<VideoPlayer url={videoUrl} />

<!-- Bad - component doing too much -->
<VideoPlayerWithStatusAndCostAndMetadata ... />
```

---

## Props Over Store Access

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

---

## Controlled vs Uncontrolled

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

---

## Composition Over Inheritance

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

---

## Prop Validation

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

---

## Default Props

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

---

## Callback Props

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

**Cross-References:**
- Component script organization: See [03-sveltekit-patterns.md](./03-sveltekit-patterns.md#component-script-organization)
- Store vs local state decisions: See [05-state-management.md](./05-state-management.md#local-vs-global-state)
- Component testing: See [09-testing.md](./09-testing.md#component-testing)
- Component documentation: See [13-documentation.md](./13-documentation.md#component-documentation)
