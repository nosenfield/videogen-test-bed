# Testing Strategies

Reference: [best-practices.md](../best-practices.md) | Related: [02-typescript.md](./02-typescript.md), [06-api-integration.md](./06-api-integration.md)

---

## Unit Test Structure

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

---

## Component Testing

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

---

## Mock API Calls

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

---

## Test Coverage

Aim for high coverage in critical paths:
- Utility functions: 90%+ coverage
- Store logic: 85%+ coverage
- Components: 70%+ coverage
- Integration tests for critical workflows

---

**Cross-References:**
- Type guards for testing: See [02-typescript.md](./02-typescript.md#type-guards)
- API service layer: See [06-api-integration.md](./06-api-integration.md#service-layer-pattern)
- Store actions to test: See [05-state-management.md](./05-state-management.md#store-actions)
