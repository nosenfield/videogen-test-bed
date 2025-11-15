# Replicate API Integration Guide

This document describes how the application integrates with the Replicate API for video generation.

## Overview

The application uses the Replicate JavaScript SDK to interact with Replicate's video generation models. All API interactions are handled through the `replicate` service module, which provides a clean abstraction over the SDK.

## Authentication

### Setup

1. **Get API Key**: Sign up at [replicate.com](https://replicate.com) and create an API token at [Account Settings > API Tokens](https://replicate.com/account/api-tokens)

2. **Configure Environment**: Add your API key to `.env`:
   ```
   VITE_REPLICATE_API_KEY=your_api_key_here
   ```

3. **Initialize Client**: The client is initialized automatically when needed:
   ```typescript
   import { initializeReplicate } from '$lib/services/replicate';
   
   initializeReplicate(); // Must be called before any API calls
   ```

### Security

- **Never commit** `.env` files or API keys to version control
- API keys are only used client-side (Vite environment variables)
- The client uses a singleton pattern to ensure only one instance exists

## API Functions

### `initializeReplicate()`

Initializes the Replicate client with authentication.

```typescript
initializeReplicate(): void
```

**Throws**: `Error` if API key is missing or invalid

**Example**:
```typescript
try {
  initializeReplicate();
} catch (error) {
  console.error('Failed to initialize:', error.message);
}
```

### `generateVideo(modelId, parameters)`

Starts a new video generation prediction.

```typescript
generateVideo(
  modelId: string,
  parameters: Record<string, string | number | boolean>
): Promise<Prediction>
```

**Parameters**:
- `modelId`: Model identifier (e.g., `"google/veo-3"`)
- `parameters`: Model-specific input parameters

**Returns**: Promise resolving to `Prediction` object

**Throws**: `Error` if client not initialized or API call fails

**Example**:
```typescript
const prediction = await generateVideo('google/veo-3', {
  prompt: 'A sunset over mountains',
  duration: 5,
  aspect_ratio: '16:9'
});
```

### `pollGenerationStatus(predictionId, onUpdate)`

Polls for generation status until completion.

```typescript
pollGenerationStatus(
  predictionId: string,
  onUpdate: (prediction: Prediction) => void
): Promise<Prediction>
```

**Parameters**:
- `predictionId`: ID of the prediction to poll
- `onUpdate`: Callback called on each status update

**Returns**: Promise resolving to final `Prediction` object

**Throws**: `Error` if polling times out or API call fails

**Polling Behavior**:
- Initial delay: 2 seconds (INITIAL_POLL_DELAY)
- Polling interval: 3 seconds (POLLING_INTERVAL)
- Maximum attempts: 400 (MAX_POLLING_ATTEMPTS)
- Total timeout: ~20 minutes

**Example**:
```typescript
const finalPrediction = await pollGenerationStatus(prediction.id, (prediction) => {
  console.log('Status:', prediction.status);
  // Update UI with current status
});
```

### `cancelGeneration(predictionId)`

Cancels an ongoing generation.

```typescript
cancelGeneration(predictionId: string): Promise<void>
```

**Parameters**:
- `predictionId`: ID of the prediction to cancel

**Throws**: `Error` if cancellation fails

**Example**:
```typescript
try {
  await cancelGeneration(predictionId);
  console.log('Generation cancelled');
} catch (error) {
  console.error('Failed to cancel:', error.message);
}
```

## Rate Limits and Costs

### Rate Limits

Replicate enforces rate limits based on your account tier:
- **Free tier**: Limited requests per minute
- **Paid tiers**: Higher limits (see [Replicate pricing](https://replicate.com/pricing))

**Handling Rate Limits**:
- The application detects rate limit errors (429 status)
- User-friendly error messages are displayed
- Users are advised to wait and retry

### Costs

**Pricing Model**:
- Most models charge **per second** of generated video
- Some models have **fixed pricing** per generation
- Costs vary by model (see model definitions in `src/lib/services/models.ts`)

**Cost Calculation**:
```typescript
// Per-second pricing
cost = baseCost * duration

// Fixed pricing
cost = baseCost
```

**Example Costs** (approximate):
- **Google Veo 3.1**: $0.15/second
- **Kling 2.5 Turbo Pro**: $0.12/second
- **LTX-Video**: $0.03/second (cost-effective for testing)

**Cost Tracking**:
- Estimated costs shown before generation
- Actual costs calculated after completion
- Session costs tracked and displayed

## Error Handling

### Error Types

The application handles several error types:

1. **API Key Errors** (401 Unauthorized)
   - Message: "API key is missing or invalid"
   - Solution: Check `.env` file and API key validity

2. **Rate Limit Errors** (429 Too Many Requests)
   - Message: "Rate limit exceeded. Please wait a moment and try again."
   - Solution: Wait before retrying or upgrade account

3. **Network Errors**
   - Message: "Network error. Please check your internet connection and try again."
   - Solution: Check internet connection and Replicate API status

4. **Timeout Errors**
   - Message: "The request took too long. Please try again."
   - Solution: Retry the generation

5. **Polling Timeout**
   - Message: "Generation is taking longer than expected. The request may still be processing on the server."
   - Solution: Check Replicate dashboard for status

6. **Validation Errors**
   - Message: Original validation error message
   - Solution: Fix parameter values

### Error Formatting

All errors are formatted using `formatErrorMessage()` utility:
- Detects error type from message content
- Provides user-friendly messages
- Preserves validation errors as-is

## Example Requests and Responses

### Starting a Generation

**Request**:
```typescript
const prediction = await generateVideo('google/veo-3', {
  prompt: 'A cat playing piano',
  duration: 5,
  aspect_ratio: '16:9'
});
```

**Response**:
```typescript
{
  id: 'abc123...',
  status: 'starting',
  input: { prompt: 'A cat playing piano', duration: 5, aspect_ratio: '16:9' },
  output: null,
  error: null,
  created_at: '2024-11-15T10:00:00Z',
  // ... other fields
}
```

### Polling Status

**During Polling**:
```typescript
{
  id: 'abc123...',
  status: 'processing',
  output: null,
  // ... other fields
}
```

**On Completion**:
```typescript
{
  id: 'abc123...',
  status: 'succeeded',
  output: {
    video: 'https://replicate.delivery/.../output.mp4'
  },
  completed_at: '2024-11-15T10:02:30Z',
  // ... other fields
}
```

**On Failure**:
```typescript
{
  id: 'abc123...',
  status: 'failed',
  error: 'Model execution failed: ...',
  // ... other fields
}
```

## Status Mapping

Replicate API statuses are mapped to internal statuses:

| Replicate Status | Internal Status | Description |
|------------------|-----------------|-------------|
| `starting` | `queued` | Generation queued |
| `processing` | `processing` | Generation in progress |
| `succeeded` | `completed` | Generation completed successfully |
| `failed` | `error` | Generation failed |
| `canceled` | `canceled` | Generation canceled |

## Video URL Extraction

Different Replicate models return video URLs in different formats. The application handles multiple formats:

1. **Direct video field**: `output.video`
2. **URL field**: `output.url`
3. **Array format**: `output.output[0]`
4. **Any string URL**: Searches for any HTTP/HTTPS URL in output

This ensures compatibility across all supported models.

## Best Practices

1. **Always initialize** the client before making API calls
2. **Handle errors** gracefully with user-friendly messages
3. **Cancel generations** when rows are removed to prevent resource waste
4. **Monitor costs** using the session cost tracker
5. **Respect rate limits** by implementing proper queuing
6. **Use appropriate models** for your use case (cost vs quality trade-offs)

## Troubleshooting

### "API key is missing or invalid"
- Verify `.env` file exists and contains `VITE_REPLICATE_API_KEY`
- Check that API key is correct (no extra spaces)
- Ensure you're using a valid Replicate API token

### "Rate limit exceeded"
- Wait a few moments before retrying
- Consider upgrading your Replicate plan
- Reduce concurrent generations

### "Generation is taking longer than expected"
- Some models take 2+ minutes to generate
- Check Replicate dashboard for actual status
- Generation may still be processing on server

### "Failed to start video generation"
- Check internet connection
- Verify Replicate API status
- Ensure model ID is correct
- Check parameter requirements for the model

## Additional Resources

- [Replicate Documentation](https://replicate.com/docs)
- [Replicate JavaScript SDK](https://github.com/replicate/replicate-javascript)
- [Replicate Model Library](https://replicate.com/explore)
- [Replicate Pricing](https://replicate.com/pricing)

