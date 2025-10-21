/**
 * Export utilities for analytics data
 * Supports CSV, JSON, and chart image exports
 */

export type ExportFormat = 'csv' | 'json';

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Extract headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Create CSV header row
  const headerRow = csvHeaders.join(',');

  // Create data rows
  const dataRows = data.map(item => {
    return csvHeaders.map(header => {
      const value = item[header];

      // Handle different value types
      if (value === null || value === undefined) {
        return '';
      }

      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download data as CSV file
 */
export function downloadCSV(data: any[], filename: string, headers?: string[]): void {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, `${filename}.json`);
}

/**
 * Download blob as file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export chart as PNG image using html2canvas
 * Note: Requires html2canvas library to be installed
 */
export async function exportChartAsPNG(
  elementId: string,
  filename: string
): Promise<void> {
  try {
    // Dynamically import html2canvas only when needed
    const html2canvas = (await import('html2canvas')).default;

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
    });

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `${filename}.png`);
      }
    });
  } catch (error) {
    console.error('Failed to export chart:', error);
    throw error;
  }
}

/**
 * Format transaction data for export
 */
export function formatTransactionsForExport(transactions: any[]): any[] {
  return transactions.map(tx => ({
    Signature: tx.signature,
    'Delivery Method': tx.delivery_method,
    Status: tx.status,
    'Cost (SOL)': tx.cost_sol,
    'Tip (SOL)': tx.tip_sol || 0,
    'Response Time (ms)': tx.response_time_ms,
    'Created At': new Date(tx.created_at).toLocaleString(),
    'Confirmed At': tx.confirmed_at ? new Date(tx.confirmed_at).toLocaleString() : 'N/A',
    'Error Message': tx.error_message || 'N/A',
  }));
}

/**
 * Format analytics data for export
 */
export function formatAnalyticsForExport(analytics: any): any[] {
  return [
    {
      Metric: 'Total Transactions',
      Value: analytics.total_transactions || 0,
    },
    {
      Metric: 'Success Rate',
      Value: `${(analytics.success_rate || 0).toFixed(2)}%`,
    },
    {
      Metric: 'Total Cost (SOL)',
      Value: (analytics.total_cost_sol || 0).toFixed(6),
    },
    {
      Metric: 'Average Cost per Transaction (SOL)',
      Value: (analytics.avg_cost_per_tx || 0).toFixed(6),
    },
    {
      Metric: 'Average Response Time (ms)',
      Value: Math.round(analytics.avg_response_time_ms || 0),
    },
    {
      Metric: 'Jito Tips Paid (SOL)',
      Value: (analytics.total_tips_sol || 0).toFixed(6),
    },
    {
      Metric: 'Jito Tips Refunded (SOL)',
      Value: (analytics.total_refunded_sol || 0).toFixed(6),
    },
  ];
}

/**
 * Format method metrics for export
 */
export function formatMethodMetricsForExport(metrics: any[]): any[] {
  return metrics.map(m => ({
    'Delivery Method': m.delivery_method,
    'Total Count': m.total_count,
    'Success Count': m.success_count,
    'Failed Count': m.failed_count,
    'Success Rate (%)': m.success_rate.toFixed(2),
    'Total Cost (SOL)': m.total_cost_sol.toFixed(6),
    'Average Cost (SOL)': (m.total_cost_sol / m.total_count).toFixed(6),
    'Average Response Time (ms)': Math.round(m.avg_response_time_ms),
  }));
}

/**
 * Format trend data for export
 */
export function formatTrendDataForExport(trends: any[]): any[] {
  return trends.map(t => ({
    Timestamp: new Date(t.timestamp).toLocaleString(),
    Value: t.value,
    Metric: t.metric || 'N/A',
  }));
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}_${timestamp}`;
}
