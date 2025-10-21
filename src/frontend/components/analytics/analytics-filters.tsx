'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, X } from 'lucide-react';

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  deliveryMethod?: 'jito' | 'rpc' | 'sanctum-sender' | 'all';
  status?: 'confirmed' | 'failed' | 'pending' | 'all';
}

interface AnalyticsFiltersProps {
  onFiltersChange: (filters: AnalyticsFilters) => void;
}

export function AnalyticsFiltersComponent({ onFiltersChange }: AnalyticsFiltersProps) {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    deliveryMethod: 'all',
    status: 'all',
  });

  const handleFilterChange = (key: keyof AnalyticsFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: AnalyticsFilters = {
      deliveryMethod: 'all',
      status: 'all',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    (filters.deliveryMethod && filters.deliveryMethod !== 'all') ||
    (filters.status && filters.status !== 'all');

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Date Range</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  const date = new Date();
                  date.setDate(date.getDate() - 7);
                  handleFilterChange('startDate', date.toISOString());
                  handleFilterChange('endDate', new Date().toISOString());
                }}
              >
                <Calendar className="h-3 w-3 mr-1" />
                7 days
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  const date = new Date();
                  date.setDate(date.getDate() - 30);
                  handleFilterChange('startDate', date.toISOString());
                  handleFilterChange('endDate', new Date().toISOString());
                }}
              >
                <Calendar className="h-3 w-3 mr-1" />
                30 days
              </Button>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Delivery Method</label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'sanctum-sender', 'jito', 'rpc'] as const).map((method) => (
                <Badge
                  key={method}
                  variant={filters.deliveryMethod === method ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange('deliveryMethod', method)}
                >
                  {method === 'all'
                    ? 'All'
                    : method === 'sanctum-sender'
                    ? 'Sanctum'
                    : method.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Status</label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'confirmed', 'failed', 'pending'] as const).map((status) => (
                <Badge
                  key={status}
                  variant={filters.status === status ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange('status', status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Quick Actions</label>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const date = new Date();
                  date.setHours(date.getHours() - 24);
                  handleFilterChange('startDate', date.toISOString());
                  handleFilterChange('endDate', new Date().toISOString());
                }}
              >
                Last 24 hours
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Active:</span>
              {filters.deliveryMethod && filters.deliveryMethod !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Method: {filters.deliveryMethod}
                </Badge>
              )}
              {filters.status && filters.status !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Status: {filters.status}
                </Badge>
              )}
              {(filters.startDate || filters.endDate) && (
                <Badge variant="secondary" className="text-xs">
                  Custom date range
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
