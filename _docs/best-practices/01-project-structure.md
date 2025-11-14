# Project Structure and Organization

Reference: [best-practices.md](../best-practices.md) | Related: [02-typescript.md](./02-typescript.md), [04-component-design.md](./04-component-design.md)

---

## Directory Naming Conventions

**Use lowercase with hyphens for directories**:
```
src/lib/components/model-selector/
src/lib/utils/format-helpers/
```

**Avoid**:
```
src/lib/components/ModelSelector/
src/lib/utils/formatHelpers/
```

---

## File Naming Conventions

**Components**: PascalCase with .svelte extension
```
ModelRow.svelte
VideoPlayer.svelte
GenerationStatus.svelte
```

**TypeScript files**: camelCase with descriptive names
```
replicate.ts
formatters.ts
validationUtils.ts
```

**Test files**: Match source file name with .test.ts suffix
```
formatters.test.ts
validationUtils.test.ts
```

---

## Colocation Principle

Keep related files together. If a component has associated types, utilities, or tests, consider colocating them:

```
components/
├── ModelRow/
│   ├── ModelRow.svelte
│   ├── ModelRow.test.ts
│   ├── types.ts
│   └── utils.ts
```

However, for this project's scope, flat structure in component directories is acceptable.

---

## Import Path Aliases

Use SvelteKit's built-in `$lib` alias consistently:

```typescript
// Good
import { formatCost } from '$lib/utils/formatting';
import Button from '$lib/components/ui/Button.svelte';

// Avoid
import { formatCost } from '../../utils/formatting';
import Button from '../ui/Button.svelte';
```

---

## Separation of Concerns

**lib/components/**: UI components only, minimal business logic
**lib/services/**: Business logic, API calls, data transformations
**lib/stores/**: State management, no UI logic
**lib/utils/**: Pure functions, no side effects
**lib/types/**: Type definitions only, no implementation

---

**Cross-References:**
- Type definitions: See [02-typescript.md](./02-typescript.md)
- Component organization: See [04-component-design.md](./04-component-design.md)
- State management structure: See [05-state-management.md](./05-state-management.md)
