# Base UI Components Tasks

This chunk contains all tasks for creating reusable base UI components. These components provide the foundational building blocks for the application interface.

## Dependencies
- Requires: [01-foundation.md](./01-foundation.md) - INIT-005 (Tailwind Configuration)

## Related Chunks
- Previous: [03-state-management.md](./03-state-management.md)
- Next: [05-feature-components.md](./05-feature-components.md)
- Required by: [05-feature-components.md](./05-feature-components.md), [06-model-row.md](./06-model-row.md)

## Tasks

### UI-001: Button Component
**Status**: Pending
**Priority**: High
**Dependencies**: INIT-005 in [01-foundation.md](./01-foundation.md)

**Objective**: Create reusable button component.

**Steps**:
1. Create `src/lib/components/ui/Button.svelte`
2. Define props: label, onClick, disabled, variant, size
3. Implement Tailwind styling with variants
4. Add hover and focus states
5. Support icon prop
6. Add accessibility attributes
7. Export component

**Acceptance Criteria**:
- Button renders correctly
- All variants work (primary, secondary, danger)
- Disabled state prevents clicks
- Accessible with keyboard navigation

---

### UI-002: Input Component
**Status**: Pending
**Priority**: High
**Dependencies**: INIT-005 in [01-foundation.md](./01-foundation.md)

**Objective**: Create reusable text input component.

**Steps**:
1. Create `src/lib/components/ui/Input.svelte`
2. Define props: value, onChange, type, placeholder, disabled, error
3. Implement Tailwind styling
4. Add error state styling
5. Support different input types
6. Add label support
7. Export component

**Acceptance Criteria**:
- Input binds to value correctly
- Error states display properly
- Supports text, number, password types
- Accessibility labels work

---

### UI-003: Select Component
**Status**: Pending
**Priority**: High
**Dependencies**: INIT-005 in [01-foundation.md](./01-foundation.md)

**Objective**: Create reusable select/dropdown component.

**Steps**:
1. Create `src/lib/components/ui/Select.svelte`
2. Define props: value, onChange, options, disabled, placeholder
3. Implement Tailwind styling
4. Support option groups
5. Add search/filter capability
6. Handle empty states
7. Export component

**Acceptance Criteria**:
- Select binds to value correctly
- Options render from array
- onChange fires on selection
- Keyboard navigation works

---

### UI-004: VideoPlayer Component
**Status**: Pending
**Priority**: Critical
**Dependencies**: INIT-005 in [01-foundation.md](./01-foundation.md)

**Objective**: Create custom video player with controls.

**Steps**:
1. Create `src/lib/components/ui/VideoPlayer.svelte`
2. Define props: videoUrl, metadata
3. Implement HTML5 video element
4. Add custom controls (play/pause, volume, progress)
5. Add fullscreen button
6. Add download button
7. Display metadata overlay
8. Handle loading and error states
9. Export component

**Acceptance Criteria**:
- Video plays in all browsers
- Controls work correctly
- Metadata displays on hover
- Download button generates correct filename
- Errors are handled gracefully

---

## Completion Checklist
- [ ] UI-001: Button Component
- [ ] UI-002: Input Component
- [ ] UI-003: Select Component
- [ ] UI-004: VideoPlayer Component

## Task Count
Total: 4 tasks

**By Priority**:
- Critical: 1 task
- High: 3 tasks

## Next Steps
After completing all base UI component tasks, proceed to [05-feature-components.md](./05-feature-components.md).
