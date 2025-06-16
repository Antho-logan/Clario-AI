import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { aiActionReporter, AIActionReport, AIActionType, AIAction } from '../services/AIActionReporter';

interface AIActionReportViewProps {
  onClose?: () => void;
  reportDays?: number;
}

export const AIActionReportView: React.FC<AIActionReportViewProps> = ({
  onClose,
  reportDays = 7,
}) => {
  const [report, setReport] = useState<AIActionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'summary' | 'detailed'>('summary');

  useEffect(() => {
    generateReport();
  }, [reportDays]);

  const generateReport = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - reportDays);
      
      const newReport = aiActionReporter.generateReport(startDate, endDate);
      setReport(newReport);
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate AI action report');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    generateReport();
  };

  const exportReport = (format: 'json' | 'csv' | 'markdown') => {
    if (!report) return;
    
    try {
      const exportedData = aiActionReporter.exportReport(report, format);
      // In a real app, you'd save this to a file or share it
      Alert.alert('Export Successful', `Report exported as ${format.toUpperCase()}`);
      console.log('Exported report:', exportedData);
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export report');
    }
  };

  const formatDuration = (ms: number | undefined): string => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Generating AI Action Report...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to generate report</Text>
        <TouchableOpacity style={styles.retryButton} onPress={generateReport}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Action Report</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Report Meta Info */}
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>
          Report ID: {report.reportId}
        </Text>
        <Text style={styles.metaText}>
          Generated: {formatDate(report.generatedAt)}
        </Text>
        <Text style={styles.metaText}>
          Period: {formatDate(report.timeRange.start)} - {formatDate(report.timeRange.end)}
        </Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{report.summary.totalActions}</Text>
          <Text style={styles.summaryLabel}>Total Actions</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, styles.successText]}>
            {report.summary.successfulActions}
          </Text>
          <Text style={styles.summaryLabel}>Successful</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, styles.errorText]}>
            {report.summary.failedActions}
          </Text>
          <Text style={styles.summaryLabel}>Failed</Text>
        </View>
      </View>

      {/* Performance Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Average Response Time:</Text>
            <Text style={styles.metricValue}>
              {report.analytics.performanceMetrics.averageResponseTime.toFixed(2)}ms
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>95th Percentile:</Text>
            <Text style={styles.metricValue}>
              {report.analytics.performanceMetrics.p95ResponseTime.toFixed(2)}ms
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Error Rate:</Text>
            <Text style={[styles.metricValue, styles.errorText]}>
              {(report.analytics.performanceMetrics.errorRate * 100).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Actions by Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions by Type</Text>
        {Object.entries(report.analytics.actionsByType).map(([type, count]) => (
          <View key={type} style={styles.actionTypeRow}>
            <Text style={styles.actionTypeLabel}>{type.replace(/_/g, ' ').toUpperCase()}</Text>
            <Text style={styles.actionTypeCount}>{count}</Text>
          </View>
        ))}
      </View>

      {/* Activity by Hour */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity by Hour</Text>
        <View style={styles.hourlyChart}>
          {Object.entries(report.analytics.actionsByHour)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([hour, count]) => {
              const maxCount = Math.max(...(Object.values(report.analytics.actionsByHour) as number[]));
              return (
                <View key={hour} style={styles.hourlyBar}>
                  <View
                    style={[
                      styles.hourlyBarFill,
                      {
                        height: Math.max(4, ((count as number) / maxCount) * 40),
                      },
                    ]}
                  />
                  <Text style={styles.hourlyLabel}>{hour}</Text>
                </View>
              );
            })}
        </View>
      </View>

      {/* View Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, selectedFormat === 'summary' && styles.toggleButtonActive]}
          onPress={() => setSelectedFormat('summary')}
        >
          <Text style={[styles.toggleButtonText, selectedFormat === 'summary' && styles.toggleButtonTextActive]}>
            Summary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, selectedFormat === 'detailed' && styles.toggleButtonActive]}
          onPress={() => setSelectedFormat('detailed')}
        >
          <Text style={[styles.toggleButtonText, selectedFormat === 'detailed' && styles.toggleButtonTextActive]}>
            Detailed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recent Actions */}
      {selectedFormat === 'detailed' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Actions</Text>
          {report.actions.slice(-10).map((action: AIAction) => (
            <View key={action.id} style={styles.actionCard}>
              <View style={styles.actionHeader}>
                <Text style={styles.actionType}>
                  {action.type.replace(/_/g, ' ').toUpperCase()}
                </Text>
                <Text style={[
                  styles.actionStatus,
                  action.status === 'success' && styles.successText,
                  action.status === 'error' && styles.errorText,
                  action.status === 'pending' && styles.pendingText,
                ]}>
                  {action.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.actionTime}>
                {formatDate(action.timestamp)}
              </Text>
              <View style={styles.actionDetails}>
                <Text style={styles.actionDetail}>
                  Duration: {formatDuration(action.duration)}
                </Text>
                {action.performance?.responseTime && (
                  <Text style={styles.actionDetail}>
                    Response: {action.performance.responseTime}ms
                  </Text>
                )}
                {action.performance?.confidenceScore && (
                  <Text style={styles.actionDetail}>
                    Confidence: {(action.performance.confidenceScore * 100).toFixed(1)}%
                  </Text>
                )}
              </View>
              {action.error && (
                <Text style={styles.actionError}>Error: {action.error}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Export Buttons */}
      <View style={styles.exportContainer}>
        <Text style={styles.sectionTitle}>Export Report</Text>
        <View style={styles.exportButtons}>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => exportReport('json')}
          >
            <Text style={styles.exportButtonText}>JSON</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => exportReport('csv')}
          >
            <Text style={styles.exportButtonText}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => exportReport('markdown')}
          >
            <Text style={styles.exportButtonText}>Markdown</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d1d1f',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  metaContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d1d1f',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  successText: {
    color: '#28a745',
  },
  errorText: {
    color: '#dc3545',
  },
  pendingText: {
    color: '#ffc107',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 16,
  },
  metricsContainer: {
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  actionTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  actionTypeLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionTypeCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  hourlyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
    paddingHorizontal: 4,
  },
  hourlyBar: {
    alignItems: 'center',
    flex: 1,
  },
  hourlyBarFill: {
    backgroundColor: '#007AFF',
    width: 12,
    borderRadius: 2,
    marginBottom: 4,
  },
  hourlyLabel: {
    fontSize: 10,
    color: '#666',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#666',
  },
  toggleButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  actionCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  actionStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  actionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionDetail: {
    fontSize: 11,
    color: '#666',
  },
  actionError: {
    fontSize: 11,
    color: '#dc3545',
    marginTop: 4,
    fontStyle: 'italic',
  },
  exportContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  exportButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default AIActionReportView;