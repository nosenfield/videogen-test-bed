# Code Quality and Maintainability

Reference: [best-practices.md](../best-practices.md) | Related: [02-typescript.md](./02-typescript.md), [13-documentation.md](./13-documentation.md)

---

## DRY Principle

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

---

## KISS Principle

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

---

## Magic Numbers

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

---

## Function Length

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

---

## Comments

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

---

## Code Reviews

Self-review checklist before committing:
- TypeScript errors resolved
- Tests pass
- No console.log statements
- Error handling in place
- Documentation updated
- Performance considered
- Accessibility checked

---

**Cross-References:**
- TypeScript constants: See [02-typescript.md](./02-typescript.md#readonly-where-appropriate)
- Function documentation: See [13-documentation.md](./13-documentation.md#jsdoc-comments)
- Error handling standards: See [07-error-handling.md](./07-error-handling.md)
