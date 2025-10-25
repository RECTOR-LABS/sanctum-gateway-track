'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  XCircle,
  TrendingDown,
  Server,
  Network,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { CardLoadingState } from '@/components/ui/loading-state';
import { getDeliveryMethodName } from '@/lib/format';
import type { DeliveryMethod } from '@/lib/types';

interface ErrorDetail {
  error_message: string;
  error_code?: string;
  count: number;
  delivery_method?: string;
  first_seen: string;
  last_seen: string;
}

interface FailureAnalysisProps {
  errors?: ErrorDetail[];
  failureRateByMethod?: {
    delivery_method: string;
    failure_rate: number;
    failed_count: number;
    total_count: number;
  }[];
  isLoading?: boolean;
}

export function FailureAnalysis({ errors, failureRateByMethod, isLoading }: FailureAnalysisProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Failure Analysis</CardTitle>
          <CardDescription>Common errors and failure patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <CardLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (!errors || errors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Failure Analysis</CardTitle>
          <CardDescription>Common errors and failure patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-6 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <div className="font-medium text-green-500">No Failures Detected</div>
              <div className="text-sm text-muted-foreground">
                All transactions are processing successfully
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Categorize errors by type
  const categorizeError = (errorMessage: string): { category: string; icon: typeof Server } => {
    const lowerMessage = errorMessage.toLowerCase();

    if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
      return { category: 'Timeout', icon: Clock };
    }
    if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
      return { category: 'Network', icon: Network };
    }
    if (lowerMessage.includes('rpc') || lowerMessage.includes('endpoint')) {
      return { category: 'RPC', icon: Server };
    }
    if (lowerMessage.includes('insufficient') || lowerMessage.includes('balance')) {
      return { category: 'Insufficient Funds', icon: AlertCircle };
    }
    if (lowerMessage.includes('invalid') || lowerMessage.includes('malformed')) {
      return { category: 'Invalid Input', icon: AlertTriangle };
    }
    return { category: 'Other', icon: XCircle };
  };

  const errorsByCategory = errors.reduce((acc, error) => {
    const { category } = categorizeError(error.error_message);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(error);
    return acc;
  }, {} as Record<string, ErrorDetail[]>);

  const totalErrors = errors.reduce((sum, e) => sum + e.count, 0);
  const uniqueErrorTypes = Object.keys(errorsByCategory).length;

  // Most common error
  const mostCommonError = errors.reduce((max, error) =>
    error.count > max.count ? error : max
  , errors[0]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Failure Analysis</CardTitle>
        <CardDescription>Common errors and failure patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div className="text-sm text-muted-foreground">Total Errors</div>
            </div>
            <div className="text-2xl font-bold">{totalErrors}</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div className="text-sm text-muted-foreground">Error Types</div>
            </div>
            <div className="text-2xl font-bold">{uniqueErrorTypes}</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div className="text-sm text-muted-foreground">Most Common</div>
            </div>
            <div className="text-xs font-medium truncate" title={mostCommonError.error_message}>
              {categorizeError(mostCommonError.error_message).category}
            </div>
            <div className="text-sm text-muted-foreground">{mostCommonError.count} occurrences</div>
          </div>
        </div>

        {/* Failure Rate by Delivery Method */}
        {failureRateByMethod && failureRateByMethod.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Failure Rate by Delivery Method</h4>
            <div className="space-y-3">
              {failureRateByMethod.map((method) => {
                const isHighFailure = method.failure_rate > 10;
                return (
                  <div
                    key={method.delivery_method}
                    className={`p-4 rounded-lg border ${
                      isHighFailure ? 'bg-red-500/5 border-red-500/20' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {getDeliveryMethodName(method.delivery_method as DeliveryMethod)}
                      </div>
                      <Badge variant={isHighFailure ? 'destructive' : 'secondary'}>
                        {method.failure_rate.toFixed(1)}% failure
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {method.failed_count} of {method.total_count} transactions failed
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Errors by Category */}
        <div>
          <h4 className="text-sm font-medium mb-3">Errors by Category</h4>
          <div className="space-y-4">
            {Object.entries(errorsByCategory).map(([category, categoryErrors]) => {
              const { icon: Icon } = categorizeError(categoryErrors[0].error_message);
              const categoryCount = categoryErrors.reduce((sum, e) => sum + e.count, 0);
              const percentage = ((categoryCount / totalErrors) * 100).toFixed(1);

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">{category}</span>
                      <Badge variant="outline">{categoryCount} errors</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    {categoryErrors.slice(0, 3).map((error, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-card text-sm">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 font-mono text-xs text-muted-foreground break-all">
                            {error.error_message}
                          </div>
                          <Badge variant="secondary">{error.count}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {error.delivery_method && (
                            <span>Method: {getDeliveryMethodName(error.delivery_method as DeliveryMethod)}</span>
                          )}
                          <span>Last seen: {new Date(error.last_seen).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    {categoryErrors.length > 3 && (
                      <div className="text-xs text-muted-foreground pl-3">
                        + {categoryErrors.length - 3} more errors in this category
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="text-sm font-medium">Actionable Insights</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                {Object.entries(errorsByCategory).map(([category, categoryErrors]) => {
                  const categoryCount = categoryErrors.reduce((sum, e) => sum + e.count, 0);
                  const percentage = ((categoryCount / totalErrors) * 100);

                  if (category === 'Timeout' && percentage > 20) {
                    return (
                      <li key={category}>
                        • {percentage.toFixed(0)}% of errors are timeouts - consider increasing timeout thresholds or checking RPC endpoint health
                      </li>
                    );
                  }
                  if (category === 'Network' && percentage > 15) {
                    return (
                      <li key={category}>
                        • Network errors account for {percentage.toFixed(0)}% of failures - Gateway's multi-endpoint routing helps mitigate this
                      </li>
                    );
                  }
                  if (category === 'Insufficient Funds' && percentage > 10) {
                    return (
                      <li key={category}>
                        • {percentage.toFixed(0)}% failures due to insufficient funds - implement balance checks before submission
                      </li>
                    );
                  }
                  return null;
                }).filter(Boolean)}
                {failureRateByMethod && failureRateByMethod.some(m => m.failure_rate > 15) && (
                  <li>
                    • Some delivery methods show elevated failure rates - Gateway automatically routes around failing endpoints
                  </li>
                )}
                {totalErrors > 0 && (
                  <li>
                    • Gateway's intelligent routing and fallback mechanisms help reduce overall failure impact
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
