/**
 * AI Action Reporter Service
 * Tracks and reports AI-related actions in the application
 */

export interface AIAction {
  id: string;
  type: AIActionType;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  metadata: Record<string, any>;
  duration?: number;
  status: 'pending' | 'success' | 'error' | 'cancelled';
  error?: string;
  performance?: {
    responseTime: number;
    tokensUsed?: number;
    modelVersion?: string;
    confidenceScore?: number;
  };
}

export enum AIActionType {
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
  
  // User Interactions with AI
  AI_SUGGESTION_ACCEPTED = 'ai_suggestion_accepted',
  AI_SUGGESTION_REJECTED = 'ai_suggestion_rejected',
  AI_FEEDBACK_PROVIDED = 'ai_feedback_provided',
  
  // System Events
  AI_MODEL_LOADED = 'ai_model_loaded',
  AI_MODEL_UPDATED = 'ai_model_updated',
  AI_TRAINING_STARTED = 'ai_training_started',
  AI_TRAINING_COMPLETED = 'ai_training_completed',
}

export interface AIActionReport {
  reportId: string;
  generatedAt: Date;
  timeRange: {
    start: Date;
    end: Date;
  };
  summary: {
    totalActions: number;
    successfulActions: number;
    failedActions: number;
    averageResponseTime: number;
    mostUsedActionType: AIActionType;
  };
  actions: AIAction[];
  analytics: {
    actionsByType: Record<AIActionType, number>;
    actionsByHour: Record<string, number>;
    performanceMetrics: {
      averageResponseTime: number;
      p95ResponseTime: number;
      errorRate: number;
    };
  };
}

class AIActionReporter {
  private actions: AIAction[] = [];
  private sessionId: string;
  private userId?: string;
  private maxStoredActions = 10000;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadStoredActions();
  }

  /**
   * Record a new AI action
   */
  async recordAction(
    type: AIActionType,
    metadata: Record<string, any> = {},
    userId?: string
  ): Promise<string> {
    const actionId = this.generateActionId();
    const action: AIAction = {
      id: actionId,
      type,
      timestamp: new Date(),
      userId: userId || this.userId,
      sessionId: this.sessionId,
      metadata,
      status: 'pending',
    };

    this.actions.push(action);
    await this.persistActions();
    
    return actionId;
  }

  /**
   * Update an existing action with completion details
   */
  async completeAction(
    actionId: string,
    status: 'success' | 'error' | 'cancelled',
    performance?: AIAction['performance'],
    error?: string
  ): Promise<void> {
    const action = this.actions.find(a => a.id === actionId);
    if (!action) {
      throw new Error(`Action with ID ${actionId} not found`);
    }

    action.status = status;
    action.duration = Date.now() - action.timestamp.getTime();
    action.performance = performance;
    action.error = error;

    await this.persistActions();
  }

  /**
   * Generate a comprehensive report of AI actions
   */
  generateReport(
    startDate?: Date,
    endDate?: Date,
    actionTypes?: AIActionType[]
  ): AIActionReport {
    const now = new Date();
    const start = startDate || new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
    const end = endDate || now;

    let filteredActions = this.actions.filter(
      action => action.timestamp >= start && action.timestamp <= end
    );

    if (actionTypes) {
      filteredActions = filteredActions.filter(action =>
        actionTypes.includes(action.type)
      );
    }

    const successfulActions = filteredActions.filter(a => a.status === 'success');
    const failedActions = filteredActions.filter(a => a.status === 'error');
    
    const responseTimes = successfulActions
      .map(a => a.performance?.responseTime)
      .filter(rt => rt !== undefined) as number[];

    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length
      : 0;

    const actionsByType = filteredActions.reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1;
      return acc;
    }, {} as Record<AIActionType, number>);

    const mostUsedActionType = Object.entries(actionsByType)
      .sort(([,a], [,b]) => b - a)[0]?.[0] as AIActionType;

    const actionsByHour = filteredActions.reduce((acc, action) => {
      const hour = action.timestamp.getHours().toString().padStart(2, '0');
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    responseTimes.sort((a, b) => a - b);
    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p95ResponseTime = responseTimes[p95Index] || 0;

    return {
      reportId: this.generateActionId(),
      generatedAt: now,
      timeRange: { start, end },
      summary: {
        totalActions: filteredActions.length,
        successfulActions: successfulActions.length,
        failedActions: failedActions.length,
        averageResponseTime,
        mostUsedActionType,
      },
      actions: filteredActions,
      analytics: {
        actionsByType,
        actionsByHour,
        performanceMetrics: {
          averageResponseTime,
          p95ResponseTime,
          errorRate: filteredActions.length > 0 
            ? failedActions.length / filteredActions.length 
            : 0,
        },
      },
    };
  }

  /**
   * Export report in various formats
   */
  exportReport(report: AIActionReport, format: 'json' | 'csv' | 'markdown'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      
      case 'csv':
        return this.convertToCSV(report);
      
      case 'markdown':
        return this.convertToMarkdown(report);
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Get real-time analytics
   */
  getRealTimeAnalytics(): {
    activeActions: number;
    todayActions: number;
    errorRate: number;
    averageResponseTime: number;
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayActions = this.actions.filter(a => a.timestamp >= today);
    const activeActions = this.actions.filter(a => a.status === 'pending');
    const completedActions = todayActions.filter(a => a.status !== 'pending');
    const failedActions = completedActions.filter(a => a.status === 'error');
    
    const responseTimes = completedActions
      .map(a => a.performance?.responseTime)
      .filter(rt => rt !== undefined) as number[];

    return {
      activeActions: activeActions.length,
      todayActions: todayActions.length,
      errorRate: completedActions.length > 0 ? failedActions.length / completedActions.length : 0,
      averageResponseTime: responseTimes.length > 0
        ? responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length
        : 0,
    };
  }

  /**
   * Clear old actions to prevent memory issues
   */
  async cleanupOldActions(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const initialCount = this.actions.length;
    this.actions = this.actions.filter(action => action.timestamp >= cutoffDate);
    
    await this.persistActions();
    return initialCount - this.actions.length;
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateActionId(): string {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async persistActions(): Promise<void> {
    try {
      // Keep only the most recent actions
      if (this.actions.length > this.maxStoredActions) {
        this.actions = this.actions.slice(-this.maxStoredActions);
      }

      // In a real app, you'd persist to AsyncStorage or a database
      // For now, we'll just keep them in memory
      console.log(`Persisted ${this.actions.length} AI actions`);
    } catch (error) {
      console.error('Failed to persist AI actions:', error);
    }
  }

  private async loadStoredActions(): Promise<void> {
    try {
      // In a real app, you'd load from AsyncStorage or a database
      console.log('Loaded stored AI actions');
    } catch (error) {
      console.error('Failed to load stored AI actions:', error);
    }
  }

  private convertToCSV(report: AIActionReport): string {
    const headers = [
      'ID', 'Type', 'Timestamp', 'Status', 'Duration', 'ResponseTime', 
      'TokensUsed', 'ConfidenceScore', 'Error'
    ];
    
    const rows = report.actions.map(action => [
      action.id,
      action.type,
      action.timestamp.toISOString(),
      action.status,
      action.duration || '',
      action.performance?.responseTime || '',
      action.performance?.tokensUsed || '',
      action.performance?.confidenceScore || '',
      action.error || ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertToMarkdown(report: AIActionReport): string {
    return `# AI Action Report

**Report ID:** ${report.reportId}  
**Generated:** ${report.generatedAt.toISOString()}  
**Time Range:** ${report.timeRange.start.toISOString()} to ${report.timeRange.end.toISOString()}

## Summary

- **Total Actions:** ${report.summary.totalActions}
- **Successful Actions:** ${report.summary.successfulActions}
- **Failed Actions:** ${report.summary.failedActions}
- **Average Response Time:** ${report.summary.averageResponseTime.toFixed(2)}ms
- **Most Used Action Type:** ${report.summary.mostUsedActionType}

## Performance Metrics

- **Average Response Time:** ${report.analytics.performanceMetrics.averageResponseTime.toFixed(2)}ms
- **95th Percentile Response Time:** ${report.analytics.performanceMetrics.p95ResponseTime.toFixed(2)}ms
- **Error Rate:** ${(report.analytics.performanceMetrics.errorRate * 100).toFixed(2)}%

## Actions by Type

${Object.entries(report.analytics.actionsByType)
  .map(([type, count]) => `- **${type}:** ${count}`)
  .join('\n')}

## Recent Actions

${report.actions.slice(-10).map(action => 
  `- **${action.type}** (${action.status}) - ${action.timestamp.toISOString()}`
).join('\n')}
`;
  }
}

// Export singleton instance
export const aiActionReporter = new AIActionReporter();
export default AIActionReporter;