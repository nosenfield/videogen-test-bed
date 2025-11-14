# API Integration

Reference: [best-practices.md](../best-practices.md) | Related: [02-typescript.md](./02-typescript.md), [07-error-handling.md](./07-error-handling.md)

---

## Service Layer Pattern

Keep API calls in service modules:

```typescript
// services/replicate.ts
export async function generateVideo(
  modelId: string,
  parameters: Record<string, any>
): Promise<Prediction> {
  try {
    const prediction = await replicate.predictions.create({
      version: modelId,
      input: parameters,
    });
    return prediction;
  } catch (error) {
    throw new APIError('Failed to generate video', error);
  }
}
```

---

## Error Handling

Create custom error classes:

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public originalError: unknown,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

Use try-catch consistently:

```typescript
async function handleGeneration() {
  try {
    const result = await generateVideo(modelId, params);
    // handle success
  } catch (error) {
    if (error instanceof APIError) {
      // handle API error
    } else if (error instanceof ValidationError) {
      // handle validation error
    } else {
      // handle unknown error
    }
  }
}
```

---

## Request Cancellation

Support request cancellation:

```typescript
let abortController: AbortController | null = null;

async function fetchData() {
  abortController = new AbortController();

  try {
    const response = await fetch(url, {
      signal: abortController.signal,
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request cancelled');
    }
    throw error;
  }
}

function cancelRequest() {
  abortController?.abort();
}
```

---

## Retry Logic

Implement exponential backoff for retries:

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
```

---

## Response Validation

Validate API responses:

```typescript
function validatePrediction(data: unknown): Prediction {
  if (!isPrediction(data)) {
    throw new ValidationError('Invalid prediction response', 'prediction');
  }
  return data;
}

async function getGenerationStatus(id: string): Promise<Prediction> {
  const response = await fetch(`/api/predictions/${id}`);
  const data = await response.json();
  return validatePrediction(data);
}
```

---

**Cross-References:**
- Type guards for validation: See [02-typescript.md](./02-typescript.md#type-guards)
- Error handling patterns: See [07-error-handling.md](./07-error-handling.md)
- API mocking for tests: See [09-testing.md](./09-testing.md#mock-api-calls)
