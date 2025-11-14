# Accessibility

Reference: [best-practices.md](../best-practices.md) | Related: [04-component-design.md](./04-component-design.md), [03-sveltekit-patterns.md](./03-sveltekit-patterns.md)

---

## Semantic HTML

Use appropriate HTML elements:

```svelte
<!-- Good -->
<button onclick={handleClick}>Generate</button>

<!-- Bad -->
<div onclick={handleClick}>Generate</div>
```

---

## ARIA Labels

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

---

## Keyboard Navigation

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

---

## Focus Management

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

---

## Color Contrast

Ensure sufficient contrast ratios:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Use Tailwind's contrast utilities

---

## Alt Text

Always provide alt text for images:

```svelte
<img
  src={thumbnailUrl}
  alt="Generated video thumbnail showing {description}"
/>
```

---

**Cross-References:**
- Component event handling: See [03-sveltekit-patterns.md](./03-sveltekit-patterns.md#event-handling)
- Button components: See [04-component-design.md](./04-component-design.md)
- Code quality checklist: See [10-code-quality.md](./10-code-quality.md#code-reviews)
