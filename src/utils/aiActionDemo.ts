/**
 * AI Action Reporting System Demo & Utilities
 * 
 * This file provides demonstration functions and utilities for testing
 * the AI Action Reporting system with sample data.
 */

import { aiActionReporter, AIActionType } from '../services/AIActionReporter';

/**
 * Generate sample AI actions for demonstration purposes
 */
export async function generateSampleData(numActions: number = 50): Promise<void> {
  console.log(`Generating ${numActions} sample AI actions...`);
  
  const actionTypes = Object.values(AIActionType);
  const users = ['user1', 'user2', 'user3', 'demo_user'];
  
  const promises = [];
  
  for (let i = 0; i < numActions; i++) {
    const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    const userId = users[Math.floor(Math.random() * users.length)];
    
    // Create a promise for each action
    const actionPromise = createSampleAction(actionType, userId, i);
    promises.push(actionPromise);
    
    // Add some delay between actions to simulate real usage
    if (i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Wait for all actions to complete
  await Promise.all(promises);
  console.log(`✅ Generated ${numActions} sample AI actions`);
}

/**
 * Create a single sample action with realistic data
 */
async function createSampleAction(actionType: AIActionType, userId: string, index: number): Promise<void> {
  try {
    // Generate realistic metadata based on action type
    const metadata = generateMetadataForActionType(actionType, index);
    
    // Record the action
    const actionId = await aiActionReporter.recordAction(actionType, metadata, userId);
    
    // Simulate processing time (realistic ranges for different action types)
    const processingTime = getRealisticProcessingTime(actionType);
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Simulate success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      // Complete successfully with performance metrics
      await aiActionReporter.completeAction(
        actionId,
        'success',
        {
          responseTime: processingTime,
          tokensUsed: getTokenUsage(actionType),
          modelVersion: getModelVersion(actionType),
          confidenceScore: 0.85 + Math.random() * 0.15, // 85-100% confidence
        }
      );
    } else {
      // Simulate failure
      const errors = [
        'Network timeout',
        'Model overloaded',
        'Invalid input format',
        'Rate limit exceeded',
        'Processing error'
      ];
      const error = errors[Math.floor(Math.random() * errors.length)];
      
      await aiActionReporter.completeAction(actionId, 'error', undefined, error);
    }
  } catch (error) {
    console.error('Error creating sample action:', error);
  }
}

/**
 * Generate realistic metadata for different action types
 */
function generateMetadataForActionType(actionType: AIActionType, index: number): Record<string, any> {
  const baseMetadata = {
    sampleIndex: index,
    timestamp: new Date().toISOString(),
  };

  switch (actionType) {
    case AIActionType.QR_CODE_ANALYSIS:
      return {
        ...baseMetadata,
        qrData: `https://example.com/product/${index}`,
        dataLength: 20 + Math.floor(Math.random() * 100),
        dataType: Math.random() > 0.5 ? 'url' : 'text',
      };

    case AIActionType.BARCODE_ANALYSIS:
      return {
        ...baseMetadata,
        barcodeData: `${1000000000000 + index}`,
        barcodeType: 'ean13',
        dataLength: 13,
      };

    case AIActionType.IMAGE_ANALYSIS:
      return {
        ...baseMetadata,
        imageUri: `file://sample_image_${index}.jpg`,
        imageSize: 1024 + Math.floor(Math.random() * 2048),
        imageFormat: 'jpg',
      };

    case AIActionType.TEXT_GENERATION:
      return {
        ...baseMetadata,
        promptLength: 50 + Math.floor(Math.random() * 200),
        maxTokens: 100 + Math.floor(Math.random() * 500),
        temperature: 0.1 + Math.random() * 0.9,
      };

    case AIActionType.SENTIMENT_ANALYSIS:
      return {
        ...baseMetadata,
        textLength: 10 + Math.floor(Math.random() * 500),
        language: Math.random() > 0.8 ? 'es' : 'en',
      };

    case AIActionType.OBJECT_DETECTION:
      return {
        ...baseMetadata,
        imageUri: `file://object_image_${index}.jpg`,
        objectCount: 1 + Math.floor(Math.random() * 5),
      };

    default:
      return baseMetadata;
  }
}

/**
 * Get realistic processing times for different action types (in milliseconds)
 */
function getRealisticProcessingTime(actionType: AIActionType): number {
  const baseTimes: Record<AIActionType, [number, number]> = {
    [AIActionType.QR_CODE_ANALYSIS]: [100, 500],
    [AIActionType.BARCODE_ANALYSIS]: [150, 400],
    [AIActionType.IMAGE_ANALYSIS]: [800, 3000],
    [AIActionType.TEXT_GENERATION]: [1000, 5000],
    [AIActionType.OBJECT_DETECTION]: [1500, 4000],
    [AIActionType.TEXT_EXTRACTION]: [600, 2000],
    [AIActionType.SENTIMENT_ANALYSIS]: [200, 800],
    [AIActionType.CLASSIFICATION]: [300, 1200],
    [AIActionType.AI_SUGGESTION_ACCEPTED]: [50, 200],
    [AIActionType.AI_SUGGESTION_REJECTED]: [50, 200],
    [AIActionType.AI_FEEDBACK_PROVIDED]: [100, 300],
    [AIActionType.AI_MODEL_LOADED]: [2000, 8000],
    [AIActionType.AI_MODEL_UPDATED]: [5000, 15000],
    [AIActionType.AI_TRAINING_STARTED]: [100, 500],
    [AIActionType.AI_TRAINING_COMPLETED]: [1000, 3000],
  };

  const [min, max] = baseTimes[actionType] || [200, 1000];
  return min + Math.floor(Math.random() * (max - min));
}

/**
 * Get realistic token usage for different action types
 */
function getTokenUsage(actionType: AIActionType): number {
  const tokenRanges: Record<AIActionType, [number, number]> = {
    [AIActionType.TEXT_GENERATION]: [50, 500],
    [AIActionType.SENTIMENT_ANALYSIS]: [10, 100],
    [AIActionType.CLASSIFICATION]: [20, 150],
    [AIActionType.TEXT_EXTRACTION]: [100, 300],
    [AIActionType.IMAGE_ANALYSIS]: [200, 800],
    [AIActionType.QR_CODE_ANALYSIS]: [5, 50],
    [AIActionType.BARCODE_ANALYSIS]: [5, 30],
    [AIActionType.OBJECT_DETECTION]: [150, 600],
    [AIActionType.AI_SUGGESTION_ACCEPTED]: [0, 10],
    [AIActionType.AI_SUGGESTION_REJECTED]: [0, 10],
    [AIActionType.AI_FEEDBACK_PROVIDED]: [10, 50],
    [AIActionType.AI_MODEL_LOADED]: [0, 0],
    [AIActionType.AI_MODEL_UPDATED]: [0, 0],
    [AIActionType.AI_TRAINING_STARTED]: [0, 0],
    [AIActionType.AI_TRAINING_COMPLETED]: [1000, 5000],
  };

  const [min, max] = tokenRanges[actionType] || [0, 100];
  return min + Math.floor(Math.random() * (max - min));
}

/**
 * Get model version for different action types
 */
function getModelVersion(actionType: AIActionType): string {
  const modelVersions: Record<AIActionType, string[]> = {
    [AIActionType.TEXT_GENERATION]: ['gpt-3.5-turbo', 'gpt-4', 'claude-3'],
    [AIActionType.IMAGE_ANALYSIS]: ['vision-v1.2', 'clip-v2.1', 'custom-vision-v3'],
    [AIActionType.SENTIMENT_ANALYSIS]: ['bert-base', 'roberta-v2', 'sentiment-v1.5'],
    [AIActionType.CLASSIFICATION]: ['classifier-v2.0', 'bert-classifier', 'custom-v1.1'],
    [AIActionType.OBJECT_DETECTION]: ['yolo-v8', 'detectron2', 'custom-detector-v2'],
    [AIActionType.TEXT_EXTRACTION]: ['tesseract-v5', 'paddleocr-v2', 'custom-ocr-v1'],
    [AIActionType.QR_CODE_ANALYSIS]: ['zxing-v3.5', 'qr-detector-v2', 'custom-qr-v1'],
    [AIActionType.BARCODE_ANALYSIS]: ['zxing-v3.5', 'barcode-v2.1', 'custom-bc-v1'],
    [AIActionType.AI_SUGGESTION_ACCEPTED]: ['suggestion-engine-v1'],
    [AIActionType.AI_SUGGESTION_REJECTED]: ['suggestion-engine-v1'],
    [AIActionType.AI_FEEDBACK_PROVIDED]: ['feedback-processor-v1'],
    [AIActionType.AI_MODEL_LOADED]: ['model-loader-v2'],
    [AIActionType.AI_MODEL_UPDATED]: ['model-updater-v1'],
    [AIActionType.AI_TRAINING_STARTED]: ['trainer-v3.0'],
    [AIActionType.AI_TRAINING_COMPLETED]: ['trainer-v3.0'],
  };

  const versions = modelVersions[actionType] || ['generic-v1.0'];
  return versions[Math.floor(Math.random() * versions.length)];
}

/**
 * Run a comprehensive demo of the AI Action Reporting system
 */
export async function runAIActionDemo(): Promise<void> {
  console.log('🚀 Starting AI Action Reporting Demo...\n');

  // Step 1: Generate sample data
  console.log('📊 Step 1: Generating sample data...');
  await generateSampleData(25);

  // Step 2: Show real-time analytics
  console.log('\n📈 Step 2: Real-time analytics:');
  const analytics = aiActionReporter.getRealTimeAnalytics();
  console.log('- Active Actions:', analytics.activeActions);
  console.log('- Today\'s Actions:', analytics.todayActions);
  console.log('- Error Rate:', (analytics.errorRate * 100).toFixed(2) + '%');
  console.log('- Average Response Time:', analytics.averageResponseTime.toFixed(2) + 'ms');

  // Step 3: Generate and display report
  console.log('\n📋 Step 3: Generating comprehensive report...');
  const report = aiActionReporter.generateReport();
  
  console.log('\n📊 Report Summary:');
  console.log('- Report ID:', report.reportId);
  console.log('- Total Actions:', report.summary.totalActions);
  console.log('- Successful Actions:', report.summary.successfulActions);
  console.log('- Failed Actions:', report.summary.failedActions);
  console.log('- Most Used Action:', report.summary.mostUsedActionType);
  console.log('- Average Response Time:', report.summary.averageResponseTime.toFixed(2) + 'ms');

  // Step 4: Show actions by type
  console.log('\n🔍 Actions by Type:');
  Object.entries(report.analytics.actionsByType)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([type, count]) => {
      console.log(`- ${type.replace(/_/g, ' ').toUpperCase()}: ${count}`);
    });

  // Step 5: Export examples
  console.log('\n💾 Step 4: Export examples:');
  
  try {
    const jsonExport = aiActionReporter.exportReport(report, 'json');
    console.log('✅ JSON Export: ' + (jsonExport.length / 1024).toFixed(1) + 'KB');

    const csvExport = aiActionReporter.exportReport(report, 'csv');
    console.log('✅ CSV Export: ' + (csvExport.length / 1024).toFixed(1) + 'KB');

    const markdownExport = aiActionReporter.exportReport(report, 'markdown');
    console.log('✅ Markdown Export: ' + (markdownExport.length / 1024).toFixed(1) + 'KB');
  } catch (error) {
    console.error('❌ Export failed:', error);
  }

  // Step 6: Cleanup demo
  console.log('\n🧹 Step 5: Cleanup (optional)...');
  const cleanedCount = await aiActionReporter.cleanupOldActions(0); // Remove all demo data
  console.log('✅ Cleaned up', cleanedCount, 'demo actions');

  console.log('\n🎉 AI Action Reporting Demo completed successfully!');
  console.log('\n📖 Check AI_ACTION_REPORTING_GUIDE.md for detailed documentation.');
}

/**
 * Test specific scenarios for the AI Action Reporting system
 */
export async function testAIActionScenarios(): Promise<void> {
  console.log('🧪 Running AI Action Test Scenarios...\n');

  // Scenario 1: Successful QR Code Scan
  console.log('Test 1: Successful QR Code Scan');
  try {
    const actionId = await aiActionReporter.recordAction(
      AIActionType.QR_CODE_ANALYSIS,
      { qrData: 'https://example.com/test', dataType: 'url' },
      'test_user'
    );
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    await aiActionReporter.completeAction(
      actionId,
      'success',
      { responseTime: 200, confidenceScore: 0.95 }
    );
    
    console.log('✅ QR Code scan completed successfully');
  } catch (error) {
    console.log('❌ QR Code scan failed:', error);
  }

  // Scenario 2: Failed Image Analysis
  console.log('\nTest 2: Failed Image Analysis');
  try {
    const actionId = await aiActionReporter.recordAction(
      AIActionType.IMAGE_ANALYSIS,
      { imageUri: 'file://test_image.jpg', imageSize: 2048 },
      'test_user'
    );
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await aiActionReporter.completeAction(
      actionId,
      'error',
      { responseTime: 1000 },
      'Image format not supported'
    );
    
    console.log('✅ Image analysis error handled correctly');
  } catch (error) {
    console.log('❌ Image analysis test failed:', error);
  }

  // Scenario 3: Long-running Text Generation
  console.log('\nTest 3: Long-running Text Generation');
  try {
    const actionId = await aiActionReporter.recordAction(
      AIActionType.TEXT_GENERATION,
      { promptLength: 150, maxTokens: 500, temperature: 0.7 },
      'test_user'
    );
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await aiActionReporter.completeAction(
      actionId,
      'success',
      { 
        responseTime: 3000, 
        tokensUsed: 487, 
        modelVersion: 'gpt-4',
        confidenceScore: 0.88 
      }
    );
    
    console.log('✅ Text generation completed successfully');
  } catch (error) {
    console.log('❌ Text generation test failed:', error);
  }

  console.log('\n🎯 All test scenarios completed!');
}

/**
 * Utility to clear all AI action data (use with caution)
 */
export async function clearAllAIActionData(): Promise<number> {
  console.log('⚠️ Clearing all AI action data...');
  const clearedCount = await aiActionReporter.cleanupOldActions(0);
  console.log(`✅ Cleared ${clearedCount} AI actions`);
  return clearedCount;
}

/**
 * Get a summary of current AI action data
 */
export function getAIActionSummary(): {
  totalActions: number;
  analytics: ReturnType<typeof aiActionReporter.getRealTimeAnalytics>;
  recentReport: ReturnType<typeof aiActionReporter.generateReport>;
} {
  const analytics = aiActionReporter.getRealTimeAnalytics();
  const recentReport = aiActionReporter.generateReport(
    new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    new Date()
  );

  return {
    totalActions: recentReport.actions.length,
    analytics,
    recentReport,
  };
}

export default {
  generateSampleData,
  runAIActionDemo,
  testAIActionScenarios,
  clearAllAIActionData,
  getAIActionSummary,
};