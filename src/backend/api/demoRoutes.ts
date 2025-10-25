import { Router, Request, Response } from 'express';
import { getDemoService } from '../services/demoService.js';

const router = Router();

/**
 * POST /api/demo/start
 * Start the live demo (send multiple transactions)
 */
router.post('/start', async (req: Request, res: Response) => {
  try {
    const { count = 10, interval = 3000 } = req.body;

    // Validate inputs
    if (count < 1 || count > 50) {
      return res.status(400).json({
        error: 'Transaction count must be between 1 and 50',
      });
    }

    if (interval < 1000 || interval > 10000) {
      return res.status(400).json({
        error: 'Interval must be between 1000ms and 10000ms',
      });
    }

    const demoService = getDemoService();

    // Check if already running
    const status = demoService.getStatus();
    if (status.isRunning) {
      return res.status(400).json({
        error: 'Demo is already running. Please wait for it to complete.',
        currentProgress: status.progress,
        total: status.total,
      });
    }

    // Start demo in background (don't await - respond immediately)
    demoService.runDemo(count, interval)
      .then((result: unknown) => {
        console.log('[Demo] Completed successfully:', result);
      })
      .catch((error: unknown) => {
        console.error('[Demo] Failed:', error);
      });

    return res.json({
      success: true,
      message: 'Demo started successfully',
      transactions: count,
      intervalMs: interval,
      estimatedDurationSeconds: Math.ceil((count * interval) / 1000),
    });
  } catch (error) {
    console.error('[Demo] Start error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to start demo',
    });
  }
});

/**
 * GET /api/demo/status
 * Get current demo status
 */
router.get('/status', (_req: Request, res: Response) => {
  try {
    const demoService = getDemoService();
    const status = demoService.getStatus();

    res.json({
      isRunning: status.isRunning,
      progress: status.progress,
      total: status.total,
      percentage: status.total > 0 ? Math.round((status.progress / status.total) * 100) : 0,
    });
  } catch (error) {
    console.error('[Demo] Status error:', error);
    res.status(500).json({
      error: 'Failed to get demo status',
    });
  }
});

export default router;
