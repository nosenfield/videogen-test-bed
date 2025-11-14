# Architecture Documentation

## Project Overview

A SvelteKit-based web application for testing and comparing video generation capabilities across multiple Replicate AI models. The application enables side-by-side comparison of model outputs, parameters, and performance characteristics.

## Technology Stack

### Frontend Framework
- **SvelteKit 2.0**: Full-stack framework with file-based routing
- **Svelte 5**: Component framework with runes-based reactivity
- **TypeScript**: Type-safe development
- **Vite**: Build tool and development server

### Styling
- **Tailwind CSS 3.x**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Autoprefixer**: Browser compatibility

### API Integration
- **Replicate JavaScript SDK**: Official client for Replicate API
- **Native Fetch API**: Backup for custom requests

### State Management
- **Svelte Stores**: Writable and derived stores for application state
- **Context API**: Component-level state sharing

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing (optional for MVP)

## Architecture Patterns

### Component Architecture
The application follows a modular component-based architecture:
- **Page Components**: Route-level components in `src/routes/`
- **UI Components**: Reusable components in `src/lib/components/`
- **Utility Functions**: Shared logic in `src/lib/utils/`
- **Type Definitions**: TypeScript types in `src/lib/types/`
- **API Services**: Replicate integration in `src/lib/services/`
- **State Stores**: Application state in `src/lib/stores/`

### State Management Strategy
- **Writable Stores**: Mutable application state
- **Derived Stores**: Computed values from base state
- **Store Subscriptions**: Reactive updates in components
- **Local Component State**: UI-specific state using Svelte runes

### Data Flow
1. User interacts with UI component
2. Component dispatches action or updates store
3. Store updates trigger reactive updates
4. API service calls Replicate API
5. Response updates store state
6. UI automatically re-renders

## Directory Structure

```
replicate-video-tester/
├── _docs/                          # Project documentation
│   ├── architecture.md            # This file
│   ├── task-list.md              # Development task list
│   ├── best-practices.md         # Development guidelines
│   └── required-reading.md       # Learning resources
│
├── src/
│   ├── lib/
│   │   ├── components/           # Reusable Svelte components
│   │   │   ├── ui/              # Generic UI components
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Input.svelte
│   │   │   │   ├── Select.svelte
│   │   │   │   └── VideoPlayer.svelte
│   │   │   ├── ModelRow.svelte   # Model test row component
│   │   │   ├── ModelSelector.svelte
│   │   │   ├── ParameterForm.svelte
│   │   │   ├── GenerationStatus.svelte
│   │   │   ├── CostEstimator.svelte
│   │   │   └── ErrorDisplay.svelte
│   │   │
│   │   ├── services/            # API and business logic
│   │   │   ├── replicate.ts     # Replicate API client
│   │   │   ├── models.ts        # Model definitions and metadata
│   │   │   └── validation.ts    # Input validation logic
│   │   │
│   │   ├── stores/              # Svelte stores
│   │   │   ├── generations.ts   # Generation state management
│   │   │   ├── models.ts        # Available models state
│   │   │   └── ui.ts            # UI state (loading, errors, etc.)
│   │   │
│   │   ├── types/               # TypeScript type definitions
│   │   │   ├── replicate.ts     # Replicate API types
│   │   │   ├── models.ts        # Model configuration types
│   │   │   └── generation.ts    # Generation state types
│   │   │
│   │   └── utils/               # Utility functions
│   │       ├── formatting.ts    # Format helpers (time, cost, etc.)
│   │       ├── validation.ts    # Validation utilities
│   │       └── constants.ts     # Application constants
│   │
│   ├── routes/
│   │   ├── +page.svelte         # Main application page
│   │   ├── +layout.svelte       # Root layout
│   │   └── +error.svelte        # Error page
│   │
│   ├── app.html                 # HTML template
│   └── app.css                  # Global styles
│
├── static/                       # Static assets
│   └── favicon.png
│
├── tests/                        # Test files
│   ├── unit/                    # Unit tests
│   └── e2e/                     # End-to-end tests
│
├── .env.example                  # Environment variables template
├── .env                         # Environment variables (gitignored)
├── .gitignore
├── .prettierrc
├── .eslintrc.cjs
├── package.json
├── svelte.config.js             # SvelteKit configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── README.md
```

## Core Components

### ModelRow Component
Represents a single model test instance with the following functionality:
- Model selection dropdown
- Dynamic parameter form based on selected model
- Generate button with cost estimation
- Generation status indicator
- Video player for output
- Error display
- Remove row button

**Props**:
- `id`: Unique identifier for the row
- `onRemove`: Callback function for removal

**State**:
- Selected model
- Parameter values
- Generation status (idle, generating, completed, error)
- Video URL
- Error message

### ModelSelector Component
Dropdown for selecting a video generation model.

**Props**:
- `value`: Currently selected model ID
- `models`: Array of available models
- `onChange`: Callback when selection changes

### ParameterForm Component
Dynamic form that renders inputs based on model schema.

**Props**:
- `modelId`: Selected model identifier
- `parameters`: Current parameter values
- `onChange`: Callback when parameters change

**Features**:
- Renders appropriate input types (text, number, select, slider)
- Displays parameter descriptions and constraints
- Real-time validation
- Parameter presets

### VideoPlayer Component
Custom video player with controls and metadata display.

**Props**:
- `videoUrl`: URL of generated video
- `metadata`: Generation metadata (model, parameters, timestamp)

**Features**:
- Play/pause controls
- Volume control
- Fullscreen support
- Download button
- Metadata overlay

### GenerationStatus Component
Visual indicator of generation progress.

**Props**:
- `status`: Current status (queued, processing, completed, error)
- `startTime`: Generation start timestamp
- `estimatedTime`: Estimated completion time

**Features**:
- Status badge with color coding
- Elapsed time display
- Progress spinner
- Estimated time remaining

### CostEstimator Component
Displays estimated and actual costs for generations.

**Props**:
- `modelId`: Model being used
- `parameters`: Generation parameters
- `actualCost`: Actual cost after generation (optional)

**Features**:
- Real-time cost estimation
- Session total cost tracking
- Cost breakdown by parameter

## State Management

### generations Store
Manages all active and completed video generations.

**Schema**:
```typescript
interface Generation {
  id: string;
  modelId: string;
  parameters: Record<string, any>;
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'error';
  videoUrl: string | null;
  error: string | null;
  startTime: number | null;
  endTime: number | null;
  cost: number | null;
  predictionId: string | null;
}

interface GenerationsState {
  items: Generation[];
  activeCount: number;
}
```

**Actions**:
- `addGeneration()`: Add new generation row
- `updateGeneration(id, updates)`: Update generation state
- `removeGeneration(id)`: Remove generation row
- `clearCompleted()`: Remove all completed generations
- `clearAll()`: Reset all generations

### models Store
Stores available model configurations and metadata.

**Schema**:
```typescript
interface Model {
  id: string;
  name: string;
  owner: string;
  version: string;
  description: string;
  capabilities: {
    textToVideo: boolean;
    imageToVideo: boolean;
    audio: boolean;
    timestampControl: boolean;
  };
  parameters: ModelParameter[];
  pricing: {
    estimatedCost: number;
    unit: string;
  };
  performance: {
    avgGenerationTime: number;
    maxDuration: number;
    resolutions: string[];
    frameRates: number[];
  };
}

interface ModelParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  description: string;
  default: any;
  required: boolean;
  min?: number;
  max?: number;
  options?: Array<{value: any, label: string}>;
}
```

**Actions**:
- `loadModels()`: Fetch and populate model data
- `getModel(id)`: Retrieve specific model
- `getModelsByCapability(capability)`: Filter models

### ui Store
Manages global UI state.

**Schema**:
```typescript
interface UIState {
  isLoading: boolean;
  globalError: string | null;
  sessionCost: number;
  maxConcurrentGenerations: number;
}
```

**Actions**:
- `setLoading(loading)`: Set loading state
- `setError(error)`: Set global error
- `updateSessionCost(cost)`: Update cumulative cost
- `clearError()`: Clear global error

## API Integration

### Replicate Service
Wrapper around Replicate JavaScript SDK.

**Key Functions**:

```typescript
// Initialize Replicate client
initializeReplicate(apiKey: string): void

// Start video generation
generateVideo(
  modelId: string,
  parameters: Record<string, any>
): Promise<Prediction>

// Poll for generation status
checkGenerationStatus(predictionId: string): Promise<Prediction>

// Cancel ongoing generation
cancelGeneration(predictionId: string): Promise<void>

// Get model schema
getModelSchema(modelId: string): Promise<ModelSchema>
```

**Error Handling**:
- Network errors: Retry with exponential backoff
- API errors: Parse and display user-friendly messages
- Validation errors: Prevent submission, show inline errors
- Rate limit errors: Display wait time and retry option

### Polling Strategy
For checking generation status:
1. Initial poll after 2 seconds
2. Subsequent polls every 3 seconds
3. Exponential backoff on errors (max 30 seconds)
4. Stop polling on completion or after 20 minutes
5. Display elapsed time during polling

## Data Persistence

### MVP Scope
- **No persistent storage**: All data is ephemeral (session-only)
- State resets on page reload
- No backend database

### Future Consideration
- Local storage for generation history
- IndexedDB for video caching
- Export/import functionality for comparison sessions

## Security Considerations

### API Key Management
- API key stored in `.env` file
- Never committed to version control
- Loaded via `import.meta.env.VITE_REPLICATE_API_KEY`
- Client-side exposure acceptable for local development tool

### Content Security
- No user authentication required
- No sensitive data storage
- Videos loaded from Replicate CDN (HTTPS)
- CORS handled by Replicate API

## Performance Optimization

### Video Loading
- Lazy load video elements
- Preload metadata only
- Poster images for completed videos
- Limit concurrent video playback

### Component Rendering
- Svelte's compile-time optimization
- Minimal DOM updates via reactive statements
- Component-level code splitting
- Debounced input handlers

### API Efficiency
- Batch operations where possible
- Cache model schemas
- Abort ongoing requests on component unmount
- Connection pooling via fetch

## Browser Compatibility

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features
- ES2020 JavaScript
- HTML5 video
- Fetch API
- CSS Grid and Flexbox
- CSS Custom Properties

### Polyfills
Not required for target browsers

## Testing Strategy

### Unit Tests (Vitest)
- Utility functions
- Store logic
- Validation functions
- Component rendering

### Integration Tests
- Component interactions
- Store updates
- API service calls (mocked)

### End-to-End Tests (Future)
- Complete user workflows
- Multi-model comparison
- Error scenarios
- Browser compatibility

## Development Environment

### Prerequisites
- Node.js 18+
- npm 9+
- Replicate API key

### Environment Variables
```
VITE_REPLICATE_API_KEY=your_api_key_here
```

### Development Workflow
1. Start dev server: `npm run dev`
2. Auto-reload on file changes
3. Type checking in real-time
4. Hot module replacement

## Build and Deployment

### Build Process
```bash
npm run build
```
Outputs to `build/` directory as static files.

### Deployment Target
Local development only (MVP scope).

### Future Deployment Options
- Static hosting (Vercel, Netlify)
- Docker container
- Self-hosted server

## Scalability Considerations

### Current Limitations
- Client-side only
- No caching layer
- No request queuing
- Limited to browser memory

### Future Enhancements
- Backend proxy for API key security
- Redis caching for model schemas
- Queue system for batch processing
- Video storage/CDN integration

## Monitoring and Debugging

### Development Tools
- Browser DevTools
- Svelte DevTools extension
- Vite debug logging
- Network tab for API inspection

### Error Tracking
- Console logging in development
- Error boundaries for component failures
- Detailed error messages in UI

### Performance Monitoring
- Browser Performance API
- Generation time tracking
- Cost tracking
- Memory usage monitoring (manual)

## Accessibility

### WCAG Compliance Target
Level AA compliance where applicable.

### Key Features
- Keyboard navigation
- Screen reader support
- Sufficient color contrast
- Focus indicators
- Alt text for images
- ARIA labels for controls

## Documentation Standards

All code should include:
- JSDoc comments for public functions
- TypeScript types for all parameters
- Inline comments for complex logic
- Component prop documentation

## Version Control

### Git Strategy
- Main branch for stable code
- Feature branches for development
- Descriptive commit messages
- No force pushes to main

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

Types: feat, fix, docs, style, refactor, test, chore

## Dependencies

### Production Dependencies
- svelte: ^5.0.0
- @sveltejs/kit: ^2.0.0
- replicate: Latest version
- tailwindcss: ^3.0.0

### Development Dependencies
- typescript: ^5.0.0
- vite: ^5.0.0
- vitest: Latest version
- eslint: ^8.0.0
- prettier: ^3.0.0
- @sveltejs/adapter-static: ^3.0.0

## Configuration Files

### svelte.config.js
- Adapter configuration (static)
- Preprocessor setup
- Path aliases

### vite.config.ts
- Plugin configuration
- Build optimization
- Environment variable handling
- Test configuration

### tailwind.config.js
- Custom color palette
- Breakpoints
- Plugin configuration
- Content paths

### tsconfig.json
- Strict mode enabled
- Path mapping for imports
- Target ES2020
- Module resolution

## Glossary

- **Generation**: A single video creation request and its associated state
- **Model Row**: UI component representing one model test instance
- **Prediction**: Replicate API term for an ongoing or completed generation
- **Store**: Svelte reactive state container
- **Parameter**: Model-specific input configuration
- **Capability**: Feature supported by a model (T2V, I2V, audio, etc.)
