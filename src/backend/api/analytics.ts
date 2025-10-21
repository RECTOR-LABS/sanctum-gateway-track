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

    res.json({
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
    res.status(500).json({
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

export default router;
