# Replicate Video Tester

A SvelteKit web application for testing and comparing AI video generation models from Replicate. This tool allows you to test multiple video generation models side-by-side, compare outputs, and track costs.

## Features

- **Multi-Model Testing**: Test up to 10 different video generation models simultaneously
- **Side-by-Side Comparison**: Compare model outputs in a single interface
- **Cost Tracking**: Real-time cost estimation and session cost tracking
- **Concurrent Generation**: Manage multiple video generations with automatic queuing
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Keyboard Navigation**: Full keyboard accessibility support
- **Error Recovery**: Automatic retry functionality for failed generations

## Available Models

The application supports 10 video generation models:

1. **Google Veo 3.1** - Premium quality, high temporal coherence
2. **Kling 2.5 Turbo Pro** - Fast premium model with advanced features
3. **Wan 2.5 T2V** - High-quality text-to-video generation
4. **Hailuo 2.3** - Fast and efficient generation
5. **PixVerse v4** - Versatile with image-to-video support
6. **Seedance 1 Pro** - Professional-grade with timestamp control
7. **Wan 2.2 Fast** - Speed-optimized for quick iterations
8. **Veo 3 Fast** - Fast version of Veo 3
9. **LTX-Video** - Cost-effective for development
10. **Minimax video-01** - Balanced quality and speed

Each model has different capabilities, pricing, and performance characteristics. See the application interface for detailed information about each model.

## Prerequisites

- Node.js 18+ and npm
- A Replicate API key ([Get one here](https://replicate.com/account/api-tokens))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd video-pipeline-exploration/replicate-video-tester
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Replicate API key to `.env`:
```
VITE_REPLICATE_API_KEY=your_api_key_here
```

## Getting Your Replicate API Key

1. Sign up for a Replicate account at [replicate.com](https://replicate.com)
2. Navigate to [Account Settings > API Tokens](https://replicate.com/account/api-tokens)
3. Create a new API token
4. Copy the token and add it to your `.env` file

**Important**: Never commit your `.env` file or share your API key publicly.

## Development

Start the development server:

```bash
npm run dev

# or start with auto-open
npm run dev -- --open
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

### Generating Videos

1. **Add a Model Row**: Click "Add Model" to create a new test row
2. **Select a Model**: Choose from the dropdown of available models
3. **Configure Parameters**: 
   - Enter a text prompt (required)
   - Adjust duration, aspect ratio, and other model-specific parameters
4. **Generate**: Click "Generate" to start video generation
5. **Monitor Progress**: Watch the status indicator and elapsed time
6. **View Results**: Once complete, the video will appear in the player

### Managing Multiple Generations

- Add multiple model rows to test different models or configurations
- The application automatically queues generations based on the concurrent limit (default: 3)
- Remove rows by clicking the "Remove" button
- Cancel ongoing generations by removing the row

### Cost Tracking

- Each model row shows an estimated cost before generation
- Actual costs are calculated and displayed after completion
- Session cost is tracked at the top of the page
- Costs are calculated based on model pricing and video duration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run all tests
- `npm run test:unit` - Run tests in watch mode
- `npm run check` - Type check with Svelte
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
replicate-video-tester/
├── src/
│   ├── lib/
│   │   ├── components/      # Svelte components
│   │   │   ├── ui/         # Base UI components
│   │   │   └── ...         # Feature components
│   │   ├── services/       # API integration
│   │   ├── stores/         # Svelte stores (state management)
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── routes/             # SvelteKit routes
├── static/                 # Static assets
└── package.json
```

## Troubleshooting

### API Key Issues

**Error: "API key is missing or invalid"**
- Verify your `.env` file exists and contains `VITE_REPLICATE_API_KEY`
- Ensure the API key is correct (no extra spaces or quotes)
- Check that you're using a valid Replicate API token

### Generation Failures

**Error: "Rate limit exceeded"**
- You've hit Replicate's rate limit
- Wait a few moments and try again
- Consider upgrading your Replicate plan for higher limits

**Error: "Network error"**
- Check your internet connection
- Verify Replicate's API status
- Try again after a moment

**Error: "Generation is taking longer than expected"**
- Some models take 2+ minutes to generate
- The generation may still be processing on Replicate's servers
- Check your Replicate dashboard for status

### Build Issues

**Type errors during build**
- Run `npm run check` to see detailed type errors
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed

**Build fails with module errors**
- Delete `.svelte-kit` directory and rebuild
- Run `npm run prepare` to sync SvelteKit

## Technology Stack

- **Framework**: SvelteKit 2.x
- **Language**: TypeScript
- **Styling**: Plain CSS with Svelte scoped styles
- **Testing**: Vitest with vitest-browser-svelte
- **API**: Replicate API
- **State Management**: Svelte stores

## Development Notes

- The application uses Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`)
- Component tests use vitest-browser-svelte for browser-based testing
- Some full interaction workflows require E2E tests (noted in test files)
- The application follows an uncontrolled component pattern for ParameterForm to prevent circular updates

## License

[Add your license information here]

## Support

For issues, questions, or contributions, please [open an issue](link-to-issues) or contact the maintainers.
