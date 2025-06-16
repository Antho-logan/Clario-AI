import { useCallback, useEffect, useState } from 'react';
import { aiActionReporter, AIActionType, AIActionReport } from '../services/AIActionReporter';

interface AIActionTracker {
  actionId: string;
  startTime: number;
}

interface UseAIActionReporterReturn {
  // Action tracking
  trackAction: (type: AIActionType, metadata?: Record<string, any>) => Promise<AIActionTracker>;
  completeAction: (
    tracker: AIActionTracker,
    success: boolean,
    error?: string,
    additionalMetadata?: Record<string, any>
  ) => Promise<void>;
  
  // Convenience methods
  trackQRCodeScan: (data: string) => Promise<AIActionTracker>;
  trackBarcodeScan: (data: string, type: string) => Promise<AIActionTracker>;
  trackImageAnalysis: (imageUri: string) => Promise<AIActionTracker>;
  
  // Analytics
  getRealTimeAnalytics: () => ReturnType<typeof aiActionReporter.getRealTimeAnalytics>;
  generateReport: (days?: number) => AIActionReport;
  
  // State
  isTracking: boolean;
  activeActions: number;
  todayActionsCount: number;
  errorRate: number;
  averageResponseTime: number;
}

export const useAIActionReporter = (userId?: string): UseAIActionReporterReturn => {
  const [isTracking, setIsTracking] = useState(false);
  const [activeActions, setActiveActions] = useState(0);
  const [todayActionsCount, setTodayActionsCount] = useState(0);
  const [errorRate, setErrorRate] = useState(0);
  const [averageResponseTime, setAverageResponseTime] = useState(0);

  // Set user ID when provided
  useEffect(() => {
    if (userId) {
      aiActionReporter.setUserId(userId);
    }
  }, [userId]);

  // Update analytics periodically
  useEffect(() => {
    const updateAnalytics = () => {
      const analytics = aiActionReporter.getRealTimeAnalytics();
      setActiveActions(analytics.activeActions);
      setTodayActionsCount(analytics.todayActions);
      setErrorRate(analytics.errorRate);
      setAverageResponseTime(analytics.averageResponseTime);
    };

    updateAnalytics();
    const interval = setInterval(updateAnalytics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const trackAction = useCallback(async (
    type: AIActionType,
    metadata: Record<string, any> = {}
  ): Promise<AIActionTracker> => {
    setIsTracking(true);
    
    try {
      const actionId = await aiActionReporter.recordAction(type, metadata, userId);
      const startTime = Date.now();
      
      return { actionId, startTime };
    } catch (error) {
      console.error('Failed to track AI action:', error);
      throw error;
    }
  }, [userId]);

  const completeAction = useCallback(async (
    tracker: AIActionTracker,
    success: boolean,
    error?: string,
    additionalMetadata?: Record<string, any>
  ): Promise<void> => {
    try {
      const endTime = Date.now();
      const responseTime = endTime - tracker.startTime;
      
      await aiActionReporter.completeAction(
        tracker.actionId,
        success ? 'success' : 'error',
        {
          responseTime,
          ...(additionalMetadata?.tokensUsed && { tokensUsed: additionalMetadata.tokensUsed }),
          ...(additionalMetadata?.modelVersion && { modelVersion: additionalMetadata.modelVersion }),
          ...(additionalMetadata?.confidenceScore && { confidenceScore: additionalMetadata.confidenceScore }),
        },
        error
      );
    } catch (actionError) {
      console.error('Failed to complete AI action:', actionError);
    } finally {
      setIsTracking(false);
    }
  }, []);

  // Convenience method for QR code scanning
  const trackQRCodeScan = useCallback(async (data: string): Promise<AIActionTracker> => {
    return trackAction(AIActionType.QR_CODE_ANALYSIS, {
      qrData: data,
      dataLength: data.length,
      dataType: detectQRDataType(data),
    });
  }, [trackAction]);

  // Convenience method for barcode scanning
  const trackBarcodeScan = useCallback(async (data: string, type: string): Promise<AIActionTracker> => {
    return trackAction(AIActionType.BARCODE_ANALYSIS, {
      barcodeData: data,
      barcodeType: type,
      dataLength: data.length,
    });
  }, [trackAction]);

  // Convenience method for image analysis
  const trackImageAnalysis = useCallback(async (imageUri: string): Promise<AIActionTracker> => {
    return trackAction(AIActionType.IMAGE_ANALYSIS, {
      imageUri,
      imageSource: imageUri.startsWith('file://') ? 'local' : 'remote',
    });
  }, [trackAction]);

  const getRealTimeAnalytics = useCallback(() => {
    return aiActionReporter.getRealTimeAnalytics();
  }, []);

  const generateReport = useCallback((days: number = 7): AIActionReport => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return aiActionReporter.generateReport(startDate, endDate);
  }, []);

  return {
    trackAction,
    completeAction,
    trackQRCodeScan,
    trackBarcodeScan,
    trackImageAnalysis,
    getRealTimeAnalytics,
    generateReport,
    isTracking,
    activeActions,
    todayActionsCount,
    errorRate,
    averageResponseTime,
  };
};

// Helper function to detect QR code data type
function detectQRDataType(data: string): string {
  if (data.startsWith('http://') || data.startsWith('https://')) {
    return 'url';
  } else if (data.startsWith('mailto:')) {
    return 'email';
  } else if (data.startsWith('tel:')) {
    return 'phone';
  } else if (data.startsWith('wifi:')) {
    return 'wifi';
  } else if (data.includes('@') && data.includes('.')) {
    return 'email';
  } else if (/^\d+$/.test(data)) {
    return 'numeric';
  } else if (data.includes('\n') || data.length > 100) {
    return 'text_block';
  } else {
    return 'text';
  }
}

export default useAIActionReporter;