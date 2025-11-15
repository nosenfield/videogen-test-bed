# End-to-End Testing Guide

This document outlines end-to-end testing procedures and test scenarios for the Replicate Video Tester application.

## Test Scenarios

### Scenario 1: Adding and Removing Rows

**Steps**:
1. Open application
2. Click "Add Model" button
3. Verify new model row appears
4. Add multiple rows (3-5)
5. Remove a row by clicking "Remove" button
6. Verify row is removed and state updates correctly

**Expected Results**:
- ✅ Rows can be added successfully
- ✅ Rows can be removed successfully
- ✅ State persists correctly
- ✅ No errors in console

### Scenario 2: Generating Videos with Different Models

**Steps**:
1. Add a model row
2. Select a model (e.g., "Google Veo 3.1")
3. Enter prompt: "A sunset over mountains"
4. Set duration: 5 seconds
5. Click "Generate"
6. Wait for generation to complete
7. Verify video appears and plays

**Test with Multiple Models**:
- Test with premium model (Veo 3.1)
- Test with fast model (Wan 2.2 Fast)
- Test with cost-effective model (LTX-Video)

**Expected Results**:
- ✅ Generation starts successfully
- ✅ Status updates correctly (queued → processing → completed)
- ✅ Video URL is extracted correctly
- ✅ Video plays successfully
- ✅ Cost is calculated and displayed

### Scenario 3: Concurrent Generations

**Steps**:
1. Add 3 model rows
2. Select different models for each
3. Configure parameters for each
4. Click "Generate" on all 3 rows
5. Verify concurrent limit is enforced (max 3 active)
6. Wait for all to complete

**Expected Results**:
- ✅ Concurrent limit is enforced correctly
- ✅ Generations queue properly when limit reached
- ✅ All generations complete successfully
- ✅ No state conflicts between rows
- ✅ Cost tracking works for all generations

### Scenario 4: Error Scenarios

**Test Cases**:

1. **Missing API Key**:
   - Remove API key from .env
   - Try to generate
   - Verify error message displays

2. **Invalid Model**:
   - Select model, then remove it from store
   - Try to generate
   - Verify error handling

3. **Network Error**:
   - Disconnect internet
   - Try to generate
   - Verify network error message

4. **Rate Limit**:
   - Generate many videos quickly
   - Verify rate limit error message

5. **Generation Failure**:
   - Use invalid parameters
   - Verify error message and retry option

**Expected Results**:
- ✅ All errors display user-friendly messages
- ✅ Retry functionality works
- ✅ Error state doesn't break application
- ✅ Users can recover from errors

### Scenario 5: Cost Tracking

**Steps**:
1. Generate video with model that has per-second pricing
2. Verify estimated cost displays before generation
3. Verify actual cost displays after completion
4. Verify session cost updates
5. Generate multiple videos
6. Verify session cost accumulates correctly

**Expected Results**:
- ✅ Estimated costs are accurate
- ✅ Actual costs match estimates (within variance)
- ✅ Session cost accumulates correctly
- ✅ Cost display formats correctly ($X.XXXX)

### Scenario 6: Video Playback

**Steps**:
1. Generate a video
2. Wait for completion
3. Verify video player appears
4. Test play/pause controls
5. Test volume control
6. Test fullscreen (if supported)
7. Test download
8. Hover to see metadata

**Expected Results**:
- ✅ Video loads and plays
- ✅ All controls work correctly
- ✅ Metadata displays on hover
- ✅ Download works
- ✅ Fullscreen works (where supported)

## Critical Workflows

### Complete User Journey

1. **Initial Setup**:
   - User opens application
   - Models load automatically
   - No errors displayed

2. **First Generation**:
   - User adds model row
   - Selects model
   - Enters prompt
   - Generates video
   - Watches video play

3. **Multiple Generations**:
   - User adds multiple rows
   - Configures different models/parameters
   - Generates concurrently
   - Compares results

4. **Error Recovery**:
   - Error occurs
   - User sees error message
   - User clicks retry
   - Generation succeeds

5. **Cost Management**:
   - User monitors session cost
   - User generates multiple videos
   - User tracks total cost

## Test Results

### ✅ All Critical Workflows

- Adding/removing rows: ✅ Working
- Generating videos: ✅ Working
- Concurrent generations: ✅ Working
- Error handling: ✅ Working
- Cost tracking: ✅ Working
- Video playback: ✅ Working

### Known Issues

None currently. All critical workflows complete successfully.

## Testing Tools

### Recommended Tools

- **Playwright**: For automated E2E tests
- **Browser DevTools**: For manual testing and debugging
- **Network Throttling**: For testing slow network conditions
- **Device Emulation**: For mobile testing

### Manual Testing

For manual testing, follow the scenarios above and verify each step completes successfully.

## Future Enhancements

- Add automated E2E tests with Playwright
- Add visual regression testing
- Add accessibility testing automation
- Add performance monitoring

