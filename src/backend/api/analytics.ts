import { Router, Request, Response } from 'express';
import {
  getOverallMetrics,
  getTransactionTimeSeries,
  getSuccessRateTimeSeries,
  getCostTimeSeries,
  getCostComparison,
  getMetricsByDeliveryMethod,
  getTopErrors,
} from '../database/dal/analytics-dal.js';
import { getTransactions } from '../database/dal/transaction-dal.js';
import type { DeliveryMethod } from '../database/types/index.js';

const router = Router();

/**
 * GET /api/analytics/overview
 * Get overall analytics metrics
 *
 * Query params:
 * - start_date: ISO date string (optional)
 * - end_date: ISO date string (optional)
 */
router.get('/overview', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.start_date ? new Date(req.query.start_date as string) : undefined;
    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : undefined;

    const metrics = await getOverallMetrics(startDate, endDate);

    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics API] Error fetching overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics overview',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/analytics/transactions
 * Get paginated transaction list with filters
 *
 * Query params:
 * - status: pending | confirmed | failed (optional)
 * - delivery_method: jito | rpc | sanctum-sender | unknown (optional)
 * - signer_pubkey: string (optional)
 * - project_id: number (optional)
 * - start_date: ISO date string (optional)
 * - end_date: ISO date string (optional)
 * - min_cost: number in lamports (optional)
 * - max_cost: number in lamports (optional)
 * - limit: number (default 50, max 200)
 * - offset: number (default 0)
 */
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const filter: any = {};

    if (req.query.status) filter.status = req.query.status as 'pending' | 'confirmed' | 'failed';
    if (req.query.delivery_method) filter.delivery_method = req.query.delivery_method as DeliveryMethod;
    if (req.query.signer_pubkey) filter.signer_pubkey = req.query.signer_pubkey as string;
    if (req.query.project_id) filter.project_id = parseInt(req.query.project_id as string, 10);
    if (req.query.start_date) filter.start_date = new Date(req.query.start_date as string);
    if (req.query.end_date) filter.end_date = new Date(req.query.end_date as string);
    if (req.query.min_cost) filter.min_cost = parseInt(req.query.min_cost as string, 10);
    if (req.query.max_cost) filter.max_cost = parseInt(req.query.max_cost as string, 10);

    // Pagination
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 50, 200);
    const offset = parseInt(req.query.offset as string, 10) || 0;

    filter.limit = limit;
    filter.offset = offset;

    const result = await getTransactions(filter);

    res.json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        hasMore: result.hasMore,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics API] Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/analytics/costs
 * Get cost analysis and comparison
 *
 * Query params:
 * - start_date: ISO date string (optional)
 * - end_date: ISO date string (optional)
 */
router.get('/costs', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.start_date ? new Date(req.query.start_date as string) : undefined;
    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : undefined;

    const costComparison = await getCostComparison(startDate, endDate);

    res.json({
      success: true,
      data: costComparison,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics API] Error fetching cost analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cost analysis',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/analytics/success-rates
 * Get success rate metrics by delivery method
 *
 * Query params:
 * - start_date: ISO date string (optional)
 * - end_date: ISO date string (optional)
 */
router.get('/success-rates', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.start_date ? new Date(req.query.start_date as string) : undefined;
    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : undefined;

    const metricsByMethod = await getMetricsByDeliveryMethod(startDate, endDate);

    res.json({
      success: true,
      data: metricsByMethod,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics API] Error fetching success rates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch success rates',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/analytics/trends
 * Get historical trend data (time series)
 *
 * Query params:
 * - type: transactions | success_rate | cost (required)
 * - interval: hour | day (default: hour)
 * - delivery_method: jito | rpc | sanctum-sender | unknown (optional, only for cost type)
 * - start_date: ISO date string (optional)
 * - end_date: ISO date string (optional)
 */
router.get('/trends', async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    const interval = (req.query.interval as 'hour' | 'day') || 'hour';
    const deliveryMethod = req.query.delivery_method as DeliveryMethod | undefined;
    const startDate = req.query.start_date ? new Date(req.query.start_date as string) : undefined;
    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : undefined;

    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: type',
      });
    }

    let data;

    switch (type) {
      case 'transactions':
        data = await getTransactionTimeSeries(interval, startDate, endDate);
        break;
      case 'success_rate':
        data = await getSuccessRateTimeSeries(interval, startDate, endDate);
        break;
      case 'cost':
        data = await getCostTimeSeries(deliveryMethod, interval, startDate, endDate);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid type. Must be: transactions, success_rate, or cost',
        });
    }

    return res.json({
      success: true,
      data: data,
      metadata: {
        type,
        interval,
        delivery_method: deliveryMethod,
        start_date: startDate,
        end_date: endDate,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics API] Error fetching trends:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch trends',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/analytics/delivery-methods
 * Get breakdown by delivery method
 *
 * Query params:
 * - start_date: ISO date string (optional)
 * - end_date: ISO date string (optional)
 */
router.get('/delivery-methods', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.start_date ? new Date(req.query.start_date as string) : undefined;
    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : undefined;

    const metrics = await getMetricsByDeliveryMethod(startDate, endDate);

    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics API] Error fetching delivery method breakdown:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch delivery method breakdown',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/analytics/errors
 * Get top error messages
 *
 * Query params:
 * - limit: number (default 10, max 50)
 * - start_date: ISO date string (optional)
 * - end_date: ISO date string (optional)
 */
router.get('/errors', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);
    const startDate = req.query.start_date ? new Date(req.query.start_date as string) : undefined;
    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : undefined;

    const errors = await getTopErrors(limit, startDate, endDate);

    res.json({
      success: true,
      data: errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics API] Error fetching top errors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top errors',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/analytics/alerts
 * Get active alerts based on system health metrics
 *
 * Returns alerts for:
 * - High failure rates (>10%)
 * - Slow response times (>5s)
 * - Cost anomalies
 * - Low success rates by delivery method
 */
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    // Get current metrics
    const overview = await getOverallMetrics();
    const methodMetrics = await getMetricsByDeliveryMethod();

    const alerts: Array<{
      id: string;
      type: 'error' | 'warning' | 'info';
      title: string;
      message: string;
      metric?: number;
      threshold?: number;
      timestamp: string;
    }> = [];

    // Alert 1: Low overall success rate
    if (overview.success_rate < 90) {
      alerts.push({
        id: `alert-success-rate-${Date.now()}`,
        type: 'error',
        title: 'Low Success Rate',
        message: `Overall success rate is ${overview.success_rate.toFixed(1)}%, below the 90% threshold. Investigate failed transactions.`,
        metric: overview.success_rate,
        threshold: 90,
        timestamp: new Date().toISOString(),
      });
    } else if (overview.success_rate < 95) {
      alerts.push({
        id: `alert-success-rate-warning-${Date.now()}`,
        type: 'warning',
        title: 'Success Rate Below Target',
        message: `Success rate is ${overview.success_rate.toFixed(1)}%. Target is 95%+.`,
        metric: overview.success_rate,
        threshold: 95,
        timestamp: new Date().toISOString(),
      });
    }

    // Alert 2: Slow response times
    if (overview.avg_response_time_ms && overview.avg_response_time_ms > 5000) {
      alerts.push({
        id: `alert-response-time-${Date.now()}`,
        type: 'warning',
        title: 'Slow Response Time',
        message: `Average response time is ${overview.avg_response_time_ms}ms, exceeding 5s threshold. Gateway may be experiencing delays.`,
        metric: overview.avg_response_time_ms,
        threshold: 5000,
        timestamp: new Date().toISOString(),
      });
    }

    // Alert 3: High failure rate by delivery method
    for (const method of methodMetrics) {
      const failureRate = (method.failed_count / method.total_count) * 100;
      if (failureRate > 20) {
        alerts.push({
          id: `alert-method-failure-${method.delivery_method}-${Date.now()}`,
          type: 'error',
          title: `${method.delivery_method} Failures`,
          message: `${method.delivery_method} has ${failureRate.toFixed(1)}% failure rate (${method.failed_count}/${method.total_count} transactions). Check connectivity.`,
          metric: failureRate,
          threshold: 20,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Alert 4: No recent transactions (if total > 0)
    if (overview.total_transactions > 0) {
      // Get transactions from last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentTransactions = await getOverallMetrics(oneHourAgo);

      if (recentTransactions.total_transactions === 0) {
        alerts.push({
          id: `alert-no-recent-txs-${Date.now()}`,
          type: 'info',
          title: 'No Recent Activity',
          message: 'No transactions processed in the last hour.',
          timestamp: new Date().toISOString(),
        });
      }
    }

    res.json({
      success: true,
      data: alerts,
      metadata: {
        total_alerts: alerts.length,
        errors: alerts.filter(a => a.type === 'error').length,
        warnings: alerts.filter(a => a.type === 'warning').length,
        info: alerts.filter(a => a.type === 'info').length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics API] Error generating alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate alerts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
