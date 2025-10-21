'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  CheckCircle2,
  Bell,
  Clock,
  TrendingDown,
  DollarSign,
} from 'lucide-react';
import { CardLoadingState } from '@/components/ui/loading-state';

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  type: 'cost' | 'performance' | 'failure_rate' | 'system';
  title: string;
  message: string;
  created_at: string;
  resolved: boolean;
  metadata?: {
    affected_method?: string;
    metric_value?: number;
    threshold?: number;
  };
}

interface AlertSystemProps {
  alerts?: Alert[];
  isLoading?: boolean;
  onDismissAlert?: (alertId: string) => void;
  onResolveAlert?: (alertId: string) => void;
}

export function AlertSystem({
  alerts,
  isLoading,
  onDismissAlert,
  onResolveAlert,
}: AlertSystemProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alert System</CardTitle>
          <CardDescription>Real-time notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <CardLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alert System</CardTitle>
          <CardDescription>Real-time notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-6 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <div className="font-medium text-green-500">All Systems Operational</div>
              <div className="text-sm text-muted-foreground">
                No active alerts at this time
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group alerts by severity
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved);
  const warningAlerts = alerts.filter(a => a.severity === 'warning' && !a.resolved);
  const infoAlerts = alerts.filter(a => a.severity === 'info' && !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  // Helper functions
  const getSeverityConfig = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          badge: 'destructive' as const,
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/20',
          badge: 'outline' as const,
        };
      case 'info':
        return {
          icon: Info,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          badge: 'secondary' as const,
        };
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'cost':
        return DollarSign;
      case 'performance':
        return Clock;
      case 'failure_rate':
        return TrendingDown;
      case 'system':
        return AlertCircle;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderAlert = (alert: Alert) => {
    const severityConfig = getSeverityConfig(alert.severity);
    const SeverityIcon = severityConfig.icon;
    const TypeIcon = getTypeIcon(alert.type);

    return (
      <div
        key={alert.id}
        className={`p-4 rounded-lg border ${severityConfig.bgColor} ${severityConfig.borderColor}`}
      >
        <div className="flex items-start gap-3">
          <SeverityIcon className={`h-5 w-5 ${severityConfig.color} mt-0.5`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-medium">{alert.title}</div>
                <Badge variant={severityConfig.badge} className="text-xs">
                  {alert.severity}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TypeIcon className="h-3 w-3" />
                  <span>{alert.type.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTimestamp(alert.created_at)}
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-3">
              {alert.message}
            </div>

            {alert.metadata && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                {alert.metadata.affected_method && (
                  <span>Method: {alert.metadata.affected_method}</span>
                )}
                {alert.metadata.metric_value !== undefined && (
                  <span>Value: {alert.metadata.metric_value}</span>
                )}
                {alert.metadata.threshold !== undefined && (
                  <span>Threshold: {alert.metadata.threshold}</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              {!alert.resolved && onResolveAlert && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResolveAlert(alert.id)}
                  className="text-xs h-7"
                >
                  Mark Resolved
                </Button>
              )}
              {onDismissAlert && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismissAlert(alert.id)}
                  className="text-xs h-7"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const activeAlertsCount = criticalAlerts.length + warningAlerts.length + infoAlerts.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alert System
            </CardTitle>
            <CardDescription>Real-time notifications and alerts</CardDescription>
          </div>
          {activeAlertsCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {activeAlertsCount} active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="text-2xl font-bold">{criticalAlerts.length}</div>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-2xl font-bold">{warningAlerts.length}</div>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <Info className="h-4 w-4 text-blue-500" />
              <div className="text-sm text-muted-foreground">Info</div>
            </div>
            <div className="text-2xl font-bold">{infoAlerts.length}</div>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Critical Alerts
            </h4>
            <div className="space-y-3">
              {criticalAlerts.map(renderAlert)}
            </div>
          </div>
        )}

        {/* Warning Alerts */}
        {warningAlerts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Warnings
            </h4>
            <div className="space-y-3">
              {warningAlerts.map(renderAlert)}
            </div>
          </div>
        )}

        {/* Info Alerts */}
        {infoAlerts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Information
            </h4>
            <div className="space-y-3">
              {infoAlerts.map(renderAlert)}
            </div>
          </div>
        )}

        {/* Resolved Alerts */}
        {resolvedAlerts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Recently Resolved ({resolvedAlerts.length})
            </h4>
            <div className="space-y-3">
              {resolvedAlerts.slice(0, 3).map(alert => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border bg-card opacity-60"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{alert.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Resolved {formatTimestamp(alert.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alert Guidelines */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="text-sm font-medium">Alert Guidelines</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Critical:</strong> Immediate action required (e.g., high failure rate, system down)</li>
                <li>• <strong>Warning:</strong> Attention needed (e.g., elevated costs, degraded performance)</li>
                <li>• <strong>Info:</strong> Informational (e.g., usage milestones, configuration changes)</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
