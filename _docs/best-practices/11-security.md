# Security Considerations

Reference: [best-practices.md](../best-practices.md) | Related: [02-typescript.md](./02-typescript.md), [06-api-integration.md](./06-api-integration.md)

---

## Environment Variables

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

---

## Input Validation

Validate and sanitize all user inputs:

```typescript
export function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .slice(0, MAX_PROMPT_LENGTH)
    .replace(/[<>]/g, ''); // Remove potential HTML
}
```

---

## XSS Prevention

Svelte automatically escapes HTML, but be careful with @html:

```svelte
<!-- Dangerous - never do this with user input -->
{@html userGeneratedContent}

<!-- Safe - Svelte escapes by default -->
{userGeneratedContent}
```

---

## HTTPS Only

Ensure all external resources use HTTPS:

```typescript
function validateUrl(url: string): boolean {
  return url.startsWith('https://');
}
```

---

**Cross-References:**
- Type validation: See [02-typescript.md](./02-typescript.md#type-guards)
- API error handling: See [06-api-integration.md](./06-api-integration.md#error-handling)
- Input sanitization utilities: See [01-project-structure.md](./01-project-structure.md#separation-of-concerns)
