# Foundation Tasks

This chunk contains all foundational setup tasks required before development can begin. These tasks establish the project structure, type system, utilities, and model configurations.

## Dependencies
- No external dependencies
- Must be completed before all other task chunks

## Related Chunks
- Next: [02-api-integration.md](./02-api-integration.md)
- Required by: All subsequent chunks

## Tasks

### INIT-001: Project Setup
**Status**: Pending
**Priority**: Critical
**Dependencies**: None

**Objective**: Initialize SvelteKit project with required dependencies.

**Steps**:
1. Run `npm create svelte@latest replicate-video-tester`
2. Select "SvelteKit demo app" template
3. Choose TypeScript for type checking
4. Add ESLint for code quality
5. Add Prettier for code formatting
6. Add Vitest for unit testing
7. Navigate to project directory: `cd replicate-video-tester`
8. Install dependencies: `npm install`

**Acceptance Criteria**:
- Project runs with `npm run dev`
- TypeScript compilation works without errors
- ESLint and Prettier are configured

---

### INIT-002: Install Additional Dependencies
**Status**: Pending
**Priority**: Critical
**Dependencies**: INIT-001

**Objective**: Add all required npm packages.

**Steps**:
1. Install Replicate SDK: `npm install replicate`
2. Install date utilities: `npm install date-fns`
3. Install type definitions: `npm install -D @types/node`
4. Install testing utilities: `npm install -D @testing-library/svelte @testing-library/jest-dom`
5. Verify all packages in package.json

**Acceptance Criteria**:
- All dependencies install without conflicts
- Replicate SDK is importable in TypeScript
- Testing libraries available for component tests
- TypeScript recognizes all type definitions

**Note**: Skipping Tailwind CSS - using plain CSS + Svelte scoped styles instead

---

### INIT-003: Environment Configuration
**Status**: Pending
**Priority**: Critical
**Dependencies**: INIT-002

**Objective**: Set up environment variables and configuration files.

**Steps**:
1. Create `.env` file in project root
2. Add `VITE_REPLICATE_API_KEY=your_key_here`
3. Create `.env.example` with placeholder values
4. Update `.gitignore` to include `.env`
5. Verify `.env` is gitignored

**Acceptance Criteria**:
- Environment variables load correctly
- `.env` file is not tracked by git
- `.env.example` exists for documentation

---

### INIT-004: Project Structure Creation
**Status**: Pending
**Priority**: High
**Dependencies**: INIT-001

**Objective**: Create directory structure as defined in architecture.md.

**Steps**:
1. Create `src/lib/components/ui/` directory
2. Create `src/lib/components/` directory
3. Create `src/lib/services/` directory
4. Create `src/lib/stores/` directory
5. Create `src/lib/types/` directory
6. Create `src/lib/utils/` directory
7. Create `_docs/` directory at project root
8. Move architecture.md to `_docs/`
9. Create placeholder README.md files in key directories

**Acceptance Criteria**:
- All directories exist as per [architecture.md](../_docs/architecture.md)
- Directory structure matches specification
- No TypeScript import errors due to missing paths

---

### INIT-005: CSS Setup
**Status**: Pending
**Priority**: Medium
**Dependencies**: INIT-001

**Objective**: Set up global CSS with custom properties and basic styling.

**Steps**:
1. Create `src/app.css` with CSS custom properties (--primary, --success, --error, etc.)
2. Add base styles for common elements (button, input, select)
3. Set up responsive container and typography
4. Import app.css in `src/routes/+layout.svelte`
5. Test that styles apply globally

**Acceptance Criteria**:
- Global CSS variables defined and accessible
- Base element styles work across components
- Layout renders with proper styling
- No CSS compilation errors

**Note**: Using plain CSS + Svelte scoped styles instead of Tailwind for simplicity

---

### TYPE-001: Replicate API Types
**Status**: Pending
**Priority**: High
**Dependencies**: INIT-004

**Objective**: Define TypeScript interfaces for Replicate API interactions.

**Steps**:
1. Create `src/lib/types/replicate.ts`
2. Define `Prediction` interface
3. Define `PredictionStatus` type
4. Define `PredictionInput` interface
5. Define `PredictionOutput` interface
6. Define `ModelSchema` interface
7. Add JSDoc comments for all types

**Acceptance Criteria**:
- All Replicate API types are defined
- Types match actual API responses
- No TypeScript errors in type file

---

### TYPE-002: Model Configuration Types
**Status**: Pending
**Priority**: High
**Dependencies**: TYPE-001

**Objective**: Define interfaces for model metadata and configuration.

**Steps**:
1. Create `src/lib/types/models.ts`
2. Define `Model` interface
3. Define `ModelParameter` interface
4. Define `ModelCapabilities` interface
5. Define `ModelPricing` interface
6. Define `ModelPerformance` interface
7. Export all types

**Acceptance Criteria**:
- Model types match [architecture.md](../_docs/architecture.md) specification
- Types are reusable across components
- All fields have appropriate types

---

### TYPE-003: Generation State Types
**Status**: Pending
**Priority**: High
**Dependencies**: TYPE-001, TYPE-002

**Objective**: Define interfaces for generation lifecycle state.

**Steps**:
1. Create `src/lib/types/generation.ts`
2. Define `Generation` interface
3. Define `GenerationStatus` type union
4. Define `GenerationsState` interface
5. Add helper types for partial updates
6. Export all types

**Acceptance Criteria**:
- Generation types support full lifecycle
- Status types match architecture specification
- Types integrate with store schemas

---

### UTIL-001: Constants Definition
**Status**: Pending
**Priority**: Medium
**Dependencies**: INIT-004

**Objective**: Define application-wide constants.

**Steps**:
1. Create `src/lib/utils/constants.ts`
2. Define `MAX_CONCURRENT_GENERATIONS = 5`
3. Define `POLLING_INTERVAL = 3000`
4. Define `MAX_POLLING_ATTEMPTS = 400`
5. Define `INITIAL_POLL_DELAY = 2000`
6. Define status color mappings
7. Export all constants

**Acceptance Criteria**:
- All constants are typed
- Constants are used consistently
- No magic numbers in codebase

---

### UTIL-002: Formatting Utilities
**Status**: Pending
**Priority**: Medium
**Dependencies**: TYPE-003, UTIL-001

**Objective**: Create functions for formatting data for display.

**Steps**:
1. Create `src/lib/utils/formatting.ts`
2. Implement `formatCost(cost: number): string`
3. Implement `formatDuration(seconds: number): string`
4. Implement `formatTimestamp(timestamp: number): string`
5. Implement `formatElapsedTime(startTime: number): string`
6. Add unit tests for each function
7. Export all functions

**Acceptance Criteria**:
- All formatting functions work correctly
- Functions handle edge cases (null, undefined, 0)
- Unit tests pass

---

### UTIL-003: Validation Utilities
**Status**: Pending
**Priority**: Medium
**Dependencies**: TYPE-002

**Objective**: Create parameter validation functions.

**Steps**:
1. Create `src/lib/utils/validation.ts`
2. Implement `validateParameter(value: any, param: ModelParameter): ValidationResult`
3. Implement `validateAllParameters(values: Record<string, any>, params: ModelParameter[]): ValidationResult`
4. Implement helper validators (number range, string length, etc.)
5. Add unit tests
6. Export validation functions

**Acceptance Criteria**:
- Validators catch invalid inputs
- Error messages are user-friendly
- Validation is type-safe

---

### MODEL-001: Model Definitions
**Status**: Pending
**Priority**: Critical
**Dependencies**: TYPE-002

**Objective**: Create configuration for top 10 video generation models.

**Steps**:
1. Create `src/lib/services/models.ts`
2. Define configuration for Google Veo 3.1
3. Define configuration for Kling 2.5 Turbo Pro
4. Define configuration for Wan 2.5 T2V
5. Define configuration for Hailuo 2.3
6. Define configuration for PixVerse v4
7. Define configuration for Seedance 1 Pro
8. Define configuration for Wan 2.2 Fast
9. Define configuration for Veo 3 Fast
10. Define configuration for LTX-Video
11. Define configuration for Minimax video-01
12. Export `AVAILABLE_MODELS` array

**Acceptance Criteria**:
- All 10 models are configured
- Each model has complete metadata
- Parameter definitions are accurate
- Model IDs match Replicate API

---

### MODEL-002: Model Selection Logic
**Status**: Pending
**Priority**: Medium
**Dependencies**: MODEL-001

**Objective**: Implement model retrieval and filtering functions.

**Steps**:
1. Add to `src/lib/services/models.ts`
2. Implement `getModelById(id: string): Model | undefined`
3. Implement `getModelsByCapability(capability: keyof ModelCapabilities): Model[]`
4. Implement `getAllModels(): Model[]`
5. Add unit tests
6. Export all functions

**Acceptance Criteria**:
- Functions retrieve correct models
- Filtering works as expected
- Functions handle missing models gracefully

---

## Completion Checklist
- [ ] INIT-001: Project Setup
- [ ] INIT-002: Install Additional Dependencies
- [ ] INIT-003: Environment Configuration
- [ ] INIT-004: Project Structure Creation
- [ ] INIT-005: Tailwind Configuration
- [ ] TYPE-001: Replicate API Types
- [ ] TYPE-002: Model Configuration Types
- [ ] TYPE-003: Generation State Types
- [ ] UTIL-001: Constants Definition
- [ ] UTIL-002: Formatting Utilities
- [ ] UTIL-003: Validation Utilities
- [ ] MODEL-001: Model Definitions
- [ ] MODEL-002: Model Selection Logic

## Task Count
Total: 13 tasks

**By Priority**:
- Critical: 4 tasks
- High: 4 tasks
- Medium: 5 tasks

## Next Steps
After completing all foundation tasks, proceed to [02-api-integration.md](./02-api-integration.md).
