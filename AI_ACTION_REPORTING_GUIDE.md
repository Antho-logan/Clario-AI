# AI Action Reporting System

## Overview

The AI Action Reporting System is a comprehensive solution for tracking, monitoring, and reporting AI-related actions in your React Native application. It provides real-time analytics, detailed performance metrics, and export capabilities for all AI operations.

## Architecture

### Core Components

1. **AIActionReporter Service** (`src/services/AIActionReporter.ts`)
   - Central service for tracking AI actions
   - Handles data persistence and analytics
   - Provides report generation and export functionality

2. **AIActionReportView Component** (`src/components/AIActionReportView.tsx`)
   - React Native component for displaying reports
   - Interactive charts and analytics
   - Multiple export formats (JSON, CSV, Markdown)

3. **useAIActionReporter Hook** (`src/hooks/useAIActionReporter.ts`)
   - React hook for easy integration
   - Automatic performance tracking
   - Convenience methods for common actions

## Key Features

### 🎯 Action Tracking
- **Comprehensive Logging**: Track all types of AI actions with detailed metadata
- **Performance Monitoring**: Automatic response time and token usage tracking
- **Error Handling**: Detailed error tracking with context
- **User Attribution**: Associate actions with specific users

### 📊 Analytics & Reporting
- **Real-time Analytics**: Live dashboard with key metrics
- **Historical Reports**: Generate reports for any time period
- **Performance Metrics**: Response times, error rates, and usage patterns
- **Export Options**: JSON, CSV, and Markdown formats

### 🔧 Developer Experience
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Easy Integration**: Simple React hook for common use cases
- **Flexible API**: Support for custom action types and metadata
- **Automatic Cleanup**: Memory management for large datasets

## Supported AI Action Types

```typescript
enum AIActionType {
  // Core AI Operations
  TEXT_GENERATION = 'text_generation',
  IMAGE_ANALYSIS = 'image_analysis',
  QR_CODE_ANALYSIS = 'qr_code_analysis',
  BARCODE_ANALYSIS = 'barcode_analysis',
  
  // ML/AI Features
  OBJECT_DETECTION = 'object_detection',
  TEXT_EXTRACTION = 'text_extraction',
  SENTIMENT_ANALYSIS = 'sentiment_analysis',
  CLASSIFICATION = 'classification',
  
  // User Interactions
  AI_SUGGESTION_ACCEPTED = 'ai_suggestion_accepted',
  AI_SUGGESTION_REJECTED = 'ai_suggestion_rejected',
  AI_FEEDBACK_PROVIDED = 'ai_feedback_provided',
  
  // System Events
  AI_MODEL_LOADED = 'ai_model_loaded',
  AI_MODEL_UPDATED = 'ai_model_updated',
  AI_TRAINING_STARTED = 'ai_training_started',
  AI_TRAINING_COMPLETED = 'ai_training_completed',
}
```

## Usage Examples

### Basic Usage with Hook

```typescript
import { useAIActionReporter } from './src/hooks/useAIActionReporter';

function MyComponent() {
  const aiReporter = useAIActionReporter('user123');

  const handleQRScan = async (data: string) => {
    // Track QR code scanning
    const tracker = await aiReporter.trackQRCodeScan(data);
    
    try {
      // Perform actual QR processing
      const result = await processQRCode(data);
      
      // Complete action successfully
      await aiReporter.completeAction(tracker, true, undefined, {
        confidenceScore: result.confidence,
      });
    } catch (error) {
      // Handle errors
      await aiReporter.completeAction(tracker, false, error.message);
    }
  };

  return (
    <View>
      <Text>Active Actions: {aiReporter.activeActions}</Text>
      <Text>Today's Actions: {aiReporter.todayActionsCount}</Text>
      <Text>Average Response: {aiReporter.averageResponseTime}ms</Text>
    </View>
  );
}
```

### Advanced Usage with Direct Service

```typescript
import { aiActionReporter, AIActionType } from './src/services/AIActionReporter';

async function performImageAnalysis(imageUri: string) {
  // Start tracking
  const actionId = await aiActionReporter.recordAction(
    AIActionType.IMAGE_ANALYSIS,
    { 
      imageUri,
      imageSize: await getImageSize(imageUri),
      modelVersion: 'v1.2.3'
    }
  );

  try {
    const startTime = Date.now();
    const result = await analyzeImage(imageUri);
    const responseTime = Date.now() - startTime;

    // Complete with performance data
    await aiActionReporter.completeAction(
      actionId,
      'success',
      {
        responseTime,
        tokensUsed: result.tokensUsed,
        confidenceScore: result.confidence,
        modelVersion: 'v1.2.3'
      }
    );

    return result;
  } catch (error) {
    await aiActionReporter.completeAction(actionId, 'error', undefined, error.message);
    throw error;
  }
}
```

### Generating Reports

```typescript
// Generate a 7-day report
const report = aiActionReporter.generateReport(
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  new Date(), // now
  [AIActionType.QR_CODE_ANALYSIS, AIActionType.IMAGE_ANALYSIS] // filter by types
);

// Export in different formats
const jsonReport = aiActionReporter.exportReport(report, 'json');
const csvReport = aiActionReporter.exportReport(report, 'csv');
const markdownReport = aiActionReporter.exportReport(report, 'markdown');
```

## Report Structure

### Summary Metrics
- **Total Actions**: Count of all recorded actions
- **Successful Actions**: Count of successfully completed actions
- **Failed Actions**: Count of failed actions
- **Average Response Time**: Mean response time across all actions
- **Most Used Action Type**: The action type with highest frequency

### Performance Analytics
- **Response Time Distribution**: P50, P95, P99 percentiles
- **Error Rate**: Percentage of failed actions
- **Actions by Hour**: Activity distribution throughout the day
- **Actions by Type**: Breakdown of usage by action type

### Export Formats

#### JSON Export
```json
{
  "reportId": "action_1234567890_abc123",
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "timeRange": {
    "start": "2024-01-08T10:30:00.000Z",
    "end": "2024-01-15T10:30:00.000Z"
  },
  "summary": {
    "totalActions": 150,
    "successfulActions": 142,
    "failedActions": 8,
    "averageResponseTime": 234.5,
    "mostUsedActionType": "qr_code_analysis"
  },
  "analytics": {
    "actionsByType": {
      "qr_code_analysis": 85,
      "image_analysis": 42,
      "text_generation": 23
    },
    "performanceMetrics": {
      "averageResponseTime": 234.5,
      "p95ResponseTime": 450.2,
      "errorRate": 0.053
    }
  }
}
```

#### CSV Export
```csv
ID,Type,Timestamp,Status,Duration,ResponseTime,TokensUsed,ConfidenceScore,Error
action_123,qr_code_analysis,2024-01-15T10:25:00.000Z,success,245,245,0,0.98,
action_124,image_analysis,2024-01-15T10:26:00.000Z,error,1200,1200,0,0,Network timeout
```

## Integration Guide

### Step 1: Install Dependencies
```bash
npm install # All dependencies are already in package.json
```

### Step 2: Initialize the Service
```typescript
import { aiActionReporter } from './src/services/AIActionReporter';

// Set user ID for session tracking
aiActionReporter.setUserId('user123');
```

### Step 3: Track Actions
```typescript
// Method 1: Using the hook (recommended)
const aiReporter = useAIActionReporter();
const tracker = await aiReporter.trackQRCodeScan(data);

// Method 2: Direct service usage
const actionId = await aiActionReporter.recordAction(AIActionType.QR_CODE_ANALYSIS, { data });
```

### Step 4: Display Reports
```typescript
import { AIActionReportView } from './src/components/AIActionReportView';

<Modal visible={showReports}>
  <AIActionReportView
    onClose={() => setShowReports(false)}
    reportDays={7}
  />
</Modal>
```

## Configuration Options

### Memory Management
```typescript
// Configure maximum stored actions (default: 10,000)
const reporter = new AIActionReporter();
reporter.maxStoredActions = 5000;

// Clean up old actions
await reporter.cleanupOldActions(30); // Remove actions older than 30 days
```

### Custom Action Types
```typescript
// Extend the AIActionType enum for custom actions
enum CustomAIActionType {
  CUSTOM_ML_MODEL = 'custom_ml_model',
  AUDIO_PROCESSING = 'audio_processing',
}

// Use with the service
await aiActionReporter.recordAction(CustomAIActionType.CUSTOM_ML_MODEL, metadata);
```

## Best Practices

### 1. Error Handling
```typescript
try {
  const tracker = await aiReporter.trackAction(AIActionType.TEXT_GENERATION);
  const result = await performAIOperation();
  await aiReporter.completeAction(tracker, true);
} catch (error) {
  // Always complete actions even on failure
  if (tracker) {
    await aiReporter.completeAction(tracker, false, error.message);
  }
}
```

### 2. Performance Monitoring
```typescript
// Include performance metadata
await aiReporter.completeAction(tracker, true, undefined, {
  responseTime: endTime - startTime,
  tokensUsed: result.tokens,
  modelVersion: 'gpt-4',
  confidenceScore: result.confidence
});
```

### 3. Privacy Considerations
```typescript
// Sanitize sensitive data before logging
const sanitizedMetadata = {
  dataLength: sensitiveData.length,
  dataType: detectDataType(sensitiveData),
  // Don't log the actual sensitive content
};

await aiActionReporter.recordAction(AIActionType.DATA_PROCESSING, sanitizedMetadata);
```

## Troubleshooting

### Common Issues

1. **Actions not appearing in reports**
   - Ensure actions are properly completed with `completeAction()`
   - Check that the time range includes the action timestamps

2. **Memory usage growing**
   - Implement regular cleanup with `cleanupOldActions()`
   - Reduce `maxStoredActions` limit if needed

3. **Performance impact**
   - Actions are logged asynchronously to minimize impact
   - Consider batching actions for high-frequency operations

### Debug Mode
```typescript
// Enable detailed logging
console.log('AI Reporter Analytics:', aiActionReporter.getRealTimeAnalytics());
console.log('Recent Actions:', aiActionReporter.actions.slice(-10));
```

## Future Enhancements

- **Remote Sync**: Sync data to cloud storage
- **Advanced Analytics**: ML-powered insights and anomaly detection
- **Custom Dashboards**: User-configurable report layouts
- **Integration APIs**: REST/GraphQL endpoints for external systems
- **Real-time Notifications**: Alert on performance thresholds

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the code examples in the source files
3. Examine the TypeScript interfaces for detailed API documentation

## License

This AI Action Reporting System is part of your React Native application and follows the same license terms.