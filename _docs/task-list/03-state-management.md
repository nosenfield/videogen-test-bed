# State Management Tasks

This chunk contains all tasks related to creating and configuring Svelte stores for application state management. These stores handle generation state, available models, and global UI state.

## Dependencies
- Requires: [01-foundation.md](./01-foundation.md) - TYPE-002 (Model Configuration Types), TYPE-003 (Generation State Types), UTIL-001 (Constants Definition), MODEL-001 (Model Definitions)

## Related Chunks
- Previous: [02-api-integration.md](./02-api-integration.md)
- Next: [04-base-ui-components.md](./04-base-ui-components.md)
- Required by: [05-feature-components.md](./05-feature-components.md), [06-model-row.md](./06-model-row.md), [07-pages.md](./07-pages.md)

## Tasks

### STORE-001: Generations Store
**Status**: Pending
**Priority**: Critical
**Dependencies**: TYPE-003 in [01-foundation.md](./01-foundation.md), UTIL-001 in [01-foundation.md](./01-foundation.md)

**Objective**: Create store for managing generation state.

**Steps**:
1. Create `src/lib/stores/generations.ts`
2. Define writable store with `GenerationsState` type
3. Implement `addGeneration()` action
4. Implement `updateGeneration(id, updates)` action
5. Implement `removeGeneration(id)` action
6. Implement `clearCompleted()` action
7. Implement `clearAll()` action
8. Create derived store for `activeCount`
9. Export store and actions

**Acceptance Criteria**:
- Store manages all generations correctly
- Actions update state immutably
- Derived values compute correctly
- Store is type-safe

---

### STORE-002: Models Store
**Status**: Pending
**Priority**: High
**Dependencies**: TYPE-002 in [01-foundation.md](./01-foundation.md), MODEL-001 in [01-foundation.md](./01-foundation.md)

**Objective**: Create store for available models.

**Steps**:
1. Create `src/lib/stores/models.ts`
2. Define writable store with `Model[]` type
3. Implement `loadModels()` action
4. Populate store with `AVAILABLE_MODELS`
5. Create derived store for filtering
6. Export store and actions

**Acceptance Criteria**:
- Store contains all configured models
- Models are accessible reactively
- Store initialization works correctly

---

### STORE-003: UI State Store
**Status**: Pending
**Priority**: Medium
**Dependencies**: TYPE-003 in [01-foundation.md](./01-foundation.md), UTIL-001 in [01-foundation.md](./01-foundation.md)

**Objective**: Create store for global UI state.

**Steps**:
1. Create `src/lib/stores/ui.ts`
2. Define writable store with `UIState` type
3. Implement `setLoading(loading)` action
4. Implement `setError(error)` action
5. Implement `clearError()` action
6. Implement `updateSessionCost(cost)` action
7. Initialize with default values
8. Export store and actions

**Acceptance Criteria**:
- UI state is centrally managed
- Loading states work correctly
- Error handling is consistent
- Session cost accumulates correctly

---

## Completion Checklist
- [ ] STORE-001: Generations Store
- [ ] STORE-002: Models Store
- [ ] STORE-003: UI State Store

## Task Count
Total: 3 tasks

**By Priority**:
- Critical: 1 task
- High: 1 task
- Medium: 1 task

## Next Steps
After completing all state management tasks, proceed to [04-base-ui-components.md](./04-base-ui-components.md).
