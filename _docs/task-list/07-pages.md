# Page Implementation Tasks

This chunk contains all tasks for implementing the application pages. These include the root layout, main application page, and error page.

## Dependencies
- Requires: [01-foundation.md](./01-foundation.md) - INIT-005
- Requires: [03-state-management.md](./03-state-management.md) - STORE-001, STORE-002, STORE-003
- Requires: [06-model-row.md](./06-model-row.md) - COMP-006

## Related Chunks
- Previous: [06-model-row.md](./06-model-row.md)
- Next: [08-integration.md](./08-integration.md)
- Required by: [08-integration.md](./08-integration.md), [09-polish.md](./09-polish.md)

## Tasks

### PAGE-001: Root Layout
**Status**: Pending
**Priority**: High
**Dependencies**: INIT-005 in [01-foundation.md](./01-foundation.md), STORE-003 in [03-state-management.md](./03-state-management.md)

**Objective**: Create root layout with global styles and structure.

**Steps**:
1. Update `src/routes/+layout.svelte`
2. Import global CSS
3. Add app header/title
4. Subscribe to UI store for global loading
5. Render global error messages
6. Add basic navigation structure
7. Include slot for page content

**Acceptance Criteria**:
- Layout renders on all pages
- Global styles apply
- Header displays consistently
- Slot renders page content

---

### PAGE-002: Main Application Page
**Status**: Pending
**Priority**: Critical
**Dependencies**: PAGE-001, COMP-006 in [06-model-row.md](./06-model-row.md), STORE-001 in [03-state-management.md](./03-state-management.md), STORE-002 in [03-state-management.md](./03-state-management.md), STORE-003 in [03-state-management.md](./03-state-management.md)

**Objective**: Create main testing interface page.

**Steps**:
1. Update `src/routes/+page.svelte`
2. Subscribe to all necessary stores
3. Render Add Model button
4. Render list of ModelRow components
5. Implement add row functionality
6. Implement remove row functionality
7. Add session cost display
8. Add clear all button
9. Handle maximum concurrent generations limit
10. Add introductory text/instructions

**Acceptance Criteria**:
- Page renders all active model rows
- Add button creates new rows
- Remove functionality works
- Concurrent generation limit enforced
- Session cost displays correctly
- UI is responsive and intuitive

---

### PAGE-003: Error Page
**Status**: Pending
**Priority**: Low
**Dependencies**: PAGE-001

**Objective**: Create error page for application failures.

**Steps**:
1. Update `src/routes/+error.svelte`
2. Access error from page data
3. Display error message
4. Add retry/home button
5. Style appropriately
6. Handle different error types

**Acceptance Criteria**:
- Error page displays for route errors
- Message is user-friendly
- Navigation back to app works

---

## Completion Checklist
- [ ] PAGE-001: Root Layout
- [ ] PAGE-002: Main Application Page
- [ ] PAGE-003: Error Page

## Task Count
Total: 3 tasks

**By Priority**:
- Critical: 1 task
- High: 1 task
- Low: 1 task

## Next Steps
After completing all page implementation tasks, proceed to [08-integration.md](./08-integration.md).
