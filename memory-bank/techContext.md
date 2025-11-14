# Technical Context: AI Video Generation Pipeline

**Last Updated**: November 14, 2024

## Tech Stack

### Frontend (SvelteKit Exploration Phase)
- **Framework**: SvelteKit 2.0 - Full-stack framework with file-based routing
- **Component Library**: Svelte 5 - Runes-based reactivity system
- **Language**: TypeScript 5.0+ - Type-safe development
- **Build Tool**: Vite 5.x - Fast development and build
- **Styling**: Plain CSS + Svelte Scoped Styles - Simple, lightweight styling approach
- **State Management**: Svelte Stores - Built-in reactive stores

### Backend / API Integration
- **Runtime**: Node.js 18+
- **API Client**: Replicate JavaScript SDK - Official Replicate client
- **HTTP Client**: Native Fetch API - For custom requests
- **Language**: TypeScript - Shared types across stack

### Video Processing
- **Composition**: FFmpeg - Video stitching, transitions, audio sync
- **Audio Analysis**: Librosa (Python) or Web Audio API - Beat detection, tempo analysis
- **Format Handling**: MP4 (h264 codec), WebM support

### External Services
- **AI Models**: Replicate API - All video, image, audio generation
- **Hosting**: TBD (Vercel, Railway, or similar for quick deployment)
- **Storage**: TBD (Temporary for MVP, CDN for future)

### Development Tools
- **Linting**: ESLint - Code quality
- **Formatting**: Prettier - Code style consistency
- **Testing**: Vitest - Unit tests
- **E2E Testing**: Playwright (optional for MVP)

---

## Development Setup

### Prerequisites
```bash
- Node.js 18+
- npm 9+ (or pnpm 8+)
- Replicate API key
- FFmpeg installed (for video composition)
```

### Installation
```bash
# Create SvelteKit project
npm create svelte@latest replicate-video-tester

# Navigate to project
cd replicate-video-tester

# Install dependencies
npm install

# Install additional packages
npm install replicate date-fns
npm install -D @types/node @testing-library/svelte @testing-library/jest-dom

# Set up environment variables
cp .env.example .env
# Add: VITE_REPLICATE_API_KEY=your_key_here

# Start development server
npm run dev
```

### Environment Variables
```bash
# Required
VITE_REPLICATE_API_KEY=     # Replicate API key for model access

# Optional (Future)
VITE_MAX_CONCURRENT_GENS=5  # Limit concurrent generations
VITE_COST_BUDGET_LIMIT=10   # Max spend per session ($)
```

---

## Dependencies

### Core Dependencies
- `svelte@^5.0.0` - Component framework with runes
- `@sveltejs/kit@^2.0.0` - Full-stack framework
- `replicate@latest` - Replicate API client
- `date-fns@latest` - Date/time formatting utilities

### Development Dependencies
- `typescript@^5.0.0` - Type checking
- `vite@^5.0.0` - Build tool
- `vitest@latest` - Testing framework
- `@testing-library/svelte@latest` - Component testing utilities
- `@testing-library/jest-dom@latest` - DOM testing matchers
- `eslint@^8.0.0` - Linting
- `prettier@^3.0.0` - Code formatting
- `@sveltejs/adapter-static@^3.0.0` - Static site adapter

### Why We Chose These
- **SvelteKit**: Fast, minimal boilerplate, excellent TypeScript support, ideal for rapid prototyping
- **Replicate SDK**: Official client with built-in polling, error handling, and model schema access
- **Plain CSS**: Simple, lightweight styling for small UI; Svelte's scoped styles prevent conflicts
- **TypeScript**: Type safety critical for AI pipeline with multiple stages and complex data flow
- **Vitest + Testing Library**: Fast testing with best practices - tests behavior, not implementation

---

## Technical Constraints

### Performance Requirements
- 30-second video generation: under 5 minutes
- 60-second video generation: under 10 minutes
- 3-minute video generation: under 20 minutes
- API polling interval: 3 seconds (balancing responsiveness vs rate limits)
- Maximum concurrent generations: 5 (to control costs)

### Quality Requirements
- Output resolution: Minimum 1080p (1920x1080)
- Frame rate: Minimum 30 FPS
- Audio quality: Clean, no clipping, proper sync
- Compression: H264 codec, reasonable file size

### Cost Constraints
- Target: Under $2.00 per minute of final video
- Must track API costs per generation
- Must implement caching to avoid redundant calls
- Must support cheaper models for iteration

### Platform Constraints
- Browser support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- JavaScript target: ES2020
- Must handle Replicate API rate limits gracefully
- No database required for MVP (ephemeral state)

### Security Requirements
- API key in .env (client-side exposure acceptable for local dev tool)
- No user authentication for MVP
- HTTPS for all API calls
- CORS handled by Replicate API

---

## Build & Deployment

### Build Process
```bash
# Development build with HMR
npm run dev

# Production build (static files)
npm run build

# Preview production build
npm run preview
```

### Deployment
```bash
# Build static site
npm run build

# Output directory: build/

# Deploy options:
# - Vercel: vercel deploy
# - Netlify: netlify deploy --prod
# - Railway: railway up
```

### Environments
- **Development**: http://localhost:5173 (Vite dev server)
- **Production**: TBD (Vercel, Railway, or similar)

---

## Replicate API Integration

### Model Selection
**Start with cheaper models for iteration**:
- LTX-Video: Fast, lower quality, cheap
- Minimax video-01: Good balance
- Wan 2.2 Fast: Speed-optimized

**Upgrade to premium models for final outputs**:
- Google Veo 3.1: Highest quality
- Kling 2.5 Turbo Pro: Premium features
- Wan 2.5 T2V: High fidelity

### API Usage Patterns
```typescript
// Initialize client
const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

// Start generation
const prediction = await replicate.predictions.create({
  version: MODEL_VERSION,
  input: { prompt, ...params }
});

// Poll for completion
const result = await replicate.wait(prediction);
```

### Rate Limiting Strategy
- Exponential backoff on 429 errors
- Maximum 3 retry attempts
- Track requests per minute
- Limit concurrent generations to 5

---

## Troubleshooting

### Common Issues

#### Issue 1: Replicate API Key Not Found
**Solution**:
- Ensure `.env` file exists with `VITE_REPLICATE_API_KEY=your_key`
- Restart dev server after adding env vars
- Check .gitignore includes .env

#### Issue 2: Video Player Not Loading
**Solution**:
- Verify video URL is valid and accessible
- Check browser console for CORS errors
- Ensure video format is supported (MP4/WebM)

#### Issue 3: Generation Times Out
**Solution**:
- Check Replicate API status
- Verify model ID is correct
- Increase polling timeout limit
- Try simpler prompt or shorter duration

#### Issue 4: Type Errors with Replicate SDK
**Solution**:
- Install @types/node: `npm install -D @types/node`
- Update tsconfig.json with proper types
- Check SDK version matches documentation
