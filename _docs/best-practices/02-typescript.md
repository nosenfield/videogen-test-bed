# TypeScript Best Practices

Reference: [best-practices.md](../best-practices.md) | Related: [01-project-structure.md](./01-project-structure.md), [06-api-integration.md](./06-api-integration.md)

---

## Strict Type Safety

Enable strict mode in tsconfig.json:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

---

## Interface vs Type

**Prefer interfaces for object shapes**:
```typescript
// Good - extensible
interface Model {
  id: string;
  name: string;
}

interface VideoModel extends Model {
  duration: number;
}
```

**Use type for unions, intersections, and primitives**:
```typescript
type GenerationStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'error';
type ModelId = string;
```

---

## Avoid Any

Never use `any`. Use `unknown` when type is truly unknown, then narrow with type guards:

```typescript
// Bad
function processData(data: any) {
  return data.value;
}

// Good
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data structure');
}
```

---

## Type Guards

Create type guards for runtime type checking:

```typescript
function isPrediction(obj: unknown): obj is Prediction {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'status' in obj
  );
}
```

---

## Utility Types

Leverage TypeScript utility types:

```typescript
// Partial for optional updates
type GenerationUpdate = Partial<Generation>;

// Pick for subset of properties
type GenerationSummary = Pick<Generation, 'id' | 'status' | 'cost'>;

// Omit to exclude properties
type GenerationInput = Omit<Generation, 'id' | 'createdAt'>;

// Record for key-value pairs
type ParameterValues = Record<string, string | number | boolean>;
```

---

## Readonly Where Appropriate

Use `readonly` for immutable data:

```typescript
interface Config {
  readonly apiKey: string;
  readonly maxConcurrentGenerations: number;
}

const CONSTANTS = {
  POLLING_INTERVAL: 3000,
  MAX_RETRIES: 3,
} as const;
```

---

## Avoid Type Assertions

Type assertions should be last resort. Prefer type guards:

```typescript
// Bad
const model = data as Model;

// Good
if (isModel(data)) {
  const model = data; // TypeScript knows it's Model
}
```

---

**Cross-References:**
- API response validation: See [06-api-integration.md](./06-api-integration.md#response-validation)
- Error type definitions: See [07-error-handling.md](./07-error-handling.md)
- Type documentation: See [13-documentation.md](./13-documentation.md#type-documentation)
