# Error Handling & Retry Logic

## Overview

The Replicate API endpoint includes robust error handling and automatic retry logic for transient server errors.

## Retry Logic

### Retryable Errors

The following HTTP status codes trigger automatic retries:
- **502 Bad Gateway** - Temporary server error
- **503 Service Unavailable** - Service temporarily unavailable
- **504 Gateway Timeout** - Request timeout

### Retry Configuration

- **Max Retries**: 3 attempts (4 total attempts including initial)
- **Backoff Strategy**: Exponential backoff
  - Attempt 1: 1 second delay
  - Attempt 2: 2 second delay
  - Attempt 3: 4 second delay

### How It Works

1. Initial request is made
2. If a retryable error occurs, the system waits and retries
3. Each retry uses exponential backoff (1s, 2s, 4s)
4. After max retries, the error is returned to the client

## Error Messages

### User-Friendly Messages

The system provides clear error messages for common scenarios:

| Status Code | Error Message |
|-------------|--------------|
| 502 | "Replicate API is temporarily unavailable (Bad Gateway). Please try again in a few moments." |
| 503 | "Replicate API is temporarily unavailable (Service Unavailable). Please try again in a few moments." |
| 504 | "Replicate API request timed out (Gateway Timeout). Please try again." |
| 401 | "Invalid API key. Please check your Replicate API key configuration." |
| 429 | "Rate limit exceeded. Please wait a moment before trying again." |

## Parameter Validation

### Supported Types

The endpoint now supports:
- **Primitives**: `string`, `number`, `boolean`, `null`
- **Arrays of Primitives**: Arrays containing only primitive values (e.g., `reference_images`)

This allows models with array parameters like:
- `reference_images` (Kling v1.6 Pro, Veo 3.1)
- Other array-based parameters

### Validation Rules

```typescript
// ✅ Allowed
{ prompt: "text" }
{ duration: 5 }
{ reference_images: ["url1", "url2", "url3"] }
{ enabled: true }
{ seed: null }

// ❌ Not Allowed
{ nested: { object: "value" } }  // Nested objects
{ mixed: ["url", { obj: "val" }] }  // Arrays with objects
```

## Debugging

### Development Mode

In development mode (`import.meta.env.DEV`), the system:
- Logs all errors to console
- Logs retry attempts with timing information
- Provides detailed error stack traces

### Error Response Format

```json
{
  "error": "User-friendly error message",
  "statusCode": 502  // Optional: HTTP status code from Replicate API
}
```

## Common Issues

### 502 Bad Gateway

**Cause**: Replicate API infrastructure is temporarily unavailable

**Solution**: 
- The system automatically retries (up to 3 times)
- If all retries fail, wait 30-60 seconds and try again
- Check Replicate status page: https://status.replicate.com

### 503 Service Unavailable

**Cause**: Replicate service is temporarily down or overloaded

**Solution**: Same as 502 - automatic retries handle this

### 504 Gateway Timeout

**Cause**: Request took too long to process

**Solution**: Automatic retries with exponential backoff

### 401 Unauthorized

**Cause**: Invalid or missing API key

**Solution**: 
- Check `.env` file has `REPLICATE_API_KEY` set
- Verify API key is valid at https://replicate.com/account/api-tokens
- Ensure API key doesn't contain placeholder text

### 429 Rate Limit

**Cause**: Too many requests in a short time

**Solution**: Wait before retrying (automatic retries don't apply to rate limits)

## Testing

To test retry logic:

1. Use a network throttling tool to simulate 502 errors
2. Monitor console logs in development mode
3. Verify exponential backoff timing

## Implementation Details

### Retry Function

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T>
```

### Error Detection

The system detects Replicate SDK `ApiError` objects which have the structure:
```typescript
{
  response: {
    status: number,
    statusText: string
  },
  message: string,
  ...
}
```

## Future Improvements

Potential enhancements:
- Configurable retry count via environment variable
- Retry for 429 rate limit errors (with longer delays)
- Circuit breaker pattern for repeated failures
- Metrics/telemetry for error rates

