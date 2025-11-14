# Feature Components Tasks

This chunk contains all tasks for creating feature-specific components. These components combine base UI elements with business logic to provide specialized functionality.

## Dependencies
- Requires: [01-foundation.md](./01-foundation.md) - TYPE-002, TYPE-003, UTIL-002, UTIL-003
- Requires: [03-state-management.md](./03-state-management.md) - STORE-002
- Requires: [04-base-ui-components.md](./04-base-ui-components.md) - UI-001, UI-002, UI-003

## Related Chunks
- Previous: [04-base-ui-components.md](./04-base-ui-components.md)
- Next: [06-model-row.md](./06-model-row.md)
- Required by: [06-model-row.md](./06-model-row.md)

## Tasks

### COMP-001: ModelSelector Component
**Status**: Pending
**Priority**: Critical
**Dependencies**: UI-003 in [04-base-ui-components.md](./04-base-ui-components.md), STORE-002 in [03-state-management.md](./03-state-management.md)

**Objective**: Create dropdown for selecting video models.

**Steps**:
1. Create `src/lib/components/ModelSelector.svelte`
2. Define props: value, onChange
3. Subscribe to models store
4. Render Select component with model options
5. Format model names for display
6. Add model descriptions in tooltips
7. Handle empty models state
8. Export component

**Acceptance Criteria**:
- All models appear in dropdown
- Selection triggers onChange correctly
- Model metadata is accessible
- Component updates when store changes

---

### COMP-002: ParameterForm Component
**Status**: Pending
**Priority**: Critical
**Dependencies**: UI-001 in [04-base-ui-components.md](./04-base-ui-components.md), UI-002 in [04-base-ui-components.md](./04-base-ui-components.md), UI-003 in [04-base-ui-components.md](./04-base-ui-components.md), TYPE-002 in [01-foundation.md](./01-foundation.md), UTIL-003 in [01-foundation.md](./01-foundation.md)

**Objective**: Create dynamic form for model parameters.

**Steps**:
1. Create `src/lib/components/ParameterForm.svelte`
2. Define props: modelId, parameters, onChange
3. Subscribe to models store to get parameter schema
4. Render appropriate input for each parameter type
5. Implement real-time validation
6. Display parameter descriptions
7. Show validation errors inline
8. Handle parameter defaults
9. Export component

**Acceptance Criteria**:
- Form renders all parameters dynamically
- Correct input types for each parameter
- Validation prevents invalid values
- onChange provides complete parameter object
- Required parameters are marked

---

### COMP-003: GenerationStatus Component
**Status**: Pending
**Priority**: High
**Dependencies**: TYPE-003 in [01-foundation.md](./01-foundation.md), UTIL-002 in [01-foundation.md](./01-foundation.md)

**Objective**: Create status indicator for generations.

**Steps**:
1. Create `src/lib/components/GenerationStatus.svelte`
2. Define props: status, startTime, estimatedTime
3. Render status badge with color coding
4. Display elapsed time counter
5. Show estimated time remaining
6. Add progress spinner for active states
7. Handle all status types
8. Export component

**Acceptance Criteria**:
- Status displays correct color for each state
- Elapsed time updates in real-time
- Spinner shows during processing
- Component handles all status values

---

### COMP-004: CostEstimator Component
**Status**: Pending
**Priority**: Medium
**Dependencies**: TYPE-002 in [01-foundation.md](./01-foundation.md), UTIL-002 in [01-foundation.md](./01-foundation.md)

**Objective**: Create cost estimation display.

**Steps**:
1. Create `src/lib/components/CostEstimator.svelte`
2. Define props: modelId, parameters, actualCost
3. Calculate estimated cost based on parameters
4. Display cost range
5. Show actual cost when available
6. Add tooltip with cost breakdown
7. Format currency correctly
8. Export component

**Acceptance Criteria**:
- Estimation updates with parameter changes
- Actual cost displays after generation
- Cost formatting is consistent
- Breakdown shows per-parameter costs

---

### COMP-005: ErrorDisplay Component
**Status**: Pending
**Priority**: Medium
**Dependencies**: UI-001 in [04-base-ui-components.md](./04-base-ui-components.md)

**Objective**: Create consistent error message display.

**Steps**:
1. Create `src/lib/components/ErrorDisplay.svelte`
2. Define props: error, onDismiss
3. Render error message with styling
4. Add dismiss button
5. Support different error severity levels
6. Auto-dismiss after timeout (optional)
7. Export component

**Acceptance Criteria**:
- Errors display clearly
- Dismiss button works
- Styling is consistent
- Component handles null/undefined gracefully

---

## Completion Checklist
- [ ] COMP-001: ModelSelector Component
- [ ] COMP-002: ParameterForm Component
- [ ] COMP-003: GenerationStatus Component
- [ ] COMP-004: CostEstimator Component
- [ ] COMP-005: ErrorDisplay Component

## Task Count
Total: 5 tasks

**By Priority**:
- Critical: 2 tasks
- High: 1 task
- Medium: 2 tasks

## Next Steps
After completing all feature component tasks, proceed to [06-model-row.md](./06-model-row.md).
