# Model Row Component Tasks

This chunk contains the single most complex component task: the ModelRow component. This component orchestrates all feature components and manages the complete generation workflow for a single model test instance.

## Dependencies
- Requires: [04-base-ui-components.md](./04-base-ui-components.md) - UI-001, UI-004
- Requires: [05-feature-components.md](./05-feature-components.md) - COMP-001, COMP-002, COMP-003, COMP-004, COMP-005

## Related Chunks
- Previous: [05-feature-components.md](./05-feature-components.md)
- Next: [07-pages.md](./07-pages.md)
- Required by: [07-pages.md](./07-pages.md), [08-integration.md](./08-integration.md)

## Tasks

### COMP-006: ModelRow Component
**Status**: Pending
**Priority**: Critical
**Dependencies**:
- COMP-001 in [05-feature-components.md](./05-feature-components.md)
- COMP-002 in [05-feature-components.md](./05-feature-components.md)
- COMP-003 in [05-feature-components.md](./05-feature-components.md)
- COMP-004 in [05-feature-components.md](./05-feature-components.md)
- COMP-005 in [05-feature-components.md](./05-feature-components.md)
- UI-001 in [04-base-ui-components.md](./04-base-ui-components.md)
- UI-004 in [04-base-ui-components.md](./04-base-ui-components.md)

**Objective**: Create main row component for model testing.

**Steps**:
1. Create `src/lib/components/ModelRow.svelte`
2. Define props: id, onRemove
3. Subscribe to generations store for this row's state
4. Render ModelSelector component
5. Render ParameterForm component
6. Render Generate button with CostEstimator
7. Render GenerationStatus component
8. Render VideoPlayer when complete
9. Render ErrorDisplay for failures
10. Add Remove button
11. Implement generation workflow
12. Export component

**Acceptance Criteria**:
- Row displays all components correctly
- Generation workflow completes successfully
- State updates reflect in UI immediately
- Remove button works
- All edge cases handled (errors, loading, etc.)

**Implementation Notes**:
This component acts as the central orchestrator for a single model test. It should:
- Manage local component state for UI interactions
- Subscribe to the generations store for persistence
- Coordinate between all child components
- Handle the full generation lifecycle from parameter input to video display
- Provide clean error recovery and user feedback

---

## Completion Checklist
- [ ] COMP-006: ModelRow Component

## Task Count
Total: 1 task

**By Priority**:
- Critical: 1 task

## Next Steps
After completing the ModelRow component, proceed to [07-pages.md](./07-pages.md).
