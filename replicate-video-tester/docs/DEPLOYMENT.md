# Deployment Guide

This document provides instructions for deploying the Replicate Video Tester application.

## Prerequisites

- Node.js 18+ installed
- npm installed
- Replicate API key

## Local Deployment

### Step 1: Build for Production

```bash
npm run build
```

This creates an optimized production build in `.svelte-kit/output`.

### Step 2: Preview Production Build

```bash
npm run preview
```

This starts a local server to preview the production build. The application will be available at `http://localhost:4173` (or the next available port).

### Step 3: Verify Production Build

1. Open the application in a browser
2. Verify all features work correctly:
   - Models load
   - Video generation works
   - Video playback works
   - Cost tracking works
3. Check browser console for errors (should be empty)
4. Test on different devices/browsers if possible

## Environment Variables

### Development

Create a `.env` file in the project root:

```
VITE_REPLICATE_API_KEY=your_api_key_here
```

### Production

For production deployment, ensure environment variables are set:

- **Vite**: Uses `VITE_` prefix for client-side variables
- **Security**: Never commit `.env` files or expose API keys

**Note**: Since this is a client-side application, API keys are exposed in the browser. This is expected behavior for this MVP. For production use, consider implementing a backend proxy.

## Bundle Size

The production build is optimized by SvelteKit:

- Code splitting: Automatic route-based splitting
- Tree shaking: Unused code removed
- Minification: JavaScript and CSS minified
- Compression: Gzip compression recommended for serving

To check bundle sizes:

```bash
npm run build
# Check .svelte-kit/output/client directory
```

## Deployment Platforms

### Static Hosting

The application can be deployed to any static hosting service:

- **Vercel**: Automatic SvelteKit support
- **Netlify**: Automatic SvelteKit support
- **GitHub Pages**: Requires adapter-static
- **Cloudflare Pages**: Automatic SvelteKit support
- **AWS S3 + CloudFront**: Static hosting

### Platform-Specific Notes

#### Vercel

1. Connect repository to Vercel
2. Set environment variable: `VITE_REPLICATE_API_KEY`
3. Deploy (automatic on push)

#### Netlify

1. Connect repository to Netlify
2. Set environment variable: `VITE_REPLICATE_API_KEY`
3. Build command: `npm run build`
4. Publish directory: `.svelte-kit/output/client`

#### GitHub Pages

Requires `@sveltejs/adapter-static`:

1. Install adapter: `npm install -D @sveltejs/adapter-static`
2. Update `svelte.config.js` to use adapter-static
3. Add `base` path if deploying to subdirectory
4. Build and deploy to `gh-pages` branch

## Security Considerations

### API Key Exposure

**Important**: The Replicate API key is exposed in the client-side bundle. This is acceptable for the MVP but consider:

1. **Rate Limiting**: Implement rate limiting on Replicate account
2. **Usage Monitoring**: Monitor API usage regularly
3. **Backend Proxy**: For production, implement a backend proxy to hide API keys

### CORS

The application makes direct API calls to Replicate. Ensure:

- CORS is properly configured (handled by Replicate API)
- No CORS errors in browser console

## Performance Optimization

### Build Optimizations

SvelteKit automatically:
- Code splits by route
- Tree shakes unused code
- Minifies JavaScript and CSS
- Optimizes images (if using image optimization)

### Runtime Optimizations

Already implemented:
- Video lazy loading
- Debounced inputs
- Efficient state management
- Proper cleanup

## Troubleshooting

### Build Fails

**Error**: Type errors during build
- **Solution**: Run `npm run check` to see detailed errors
- **Solution**: Ensure all dependencies installed: `npm install`

**Error**: Module not found
- **Solution**: Delete `node_modules` and `.svelte-kit`, then `npm install`

### Production Build Issues

**Error**: Environment variables not working
- **Solution**: Ensure variables use `VITE_` prefix
- **Solution**: Rebuild after changing `.env` file

**Error**: API calls failing
- **Solution**: Verify API key is correct
- **Solution**: Check network tab for CORS errors

### Preview Issues

**Error**: Port already in use
- **Solution**: Use `npm run preview -- --port 4174` to specify different port

## Verification Checklist

Before deploying:

- [ ] Production build completes without errors
- [ ] Preview works correctly
- [ ] All features work in production mode
- [ ] Environment variables configured
- [ ] Bundle size is reasonable
- [ ] No console errors
- [ ] Performance is acceptable

## Next Steps

After successful deployment:

1. Monitor error rates
2. Monitor API usage and costs
3. Collect user feedback
4. Plan future enhancements

