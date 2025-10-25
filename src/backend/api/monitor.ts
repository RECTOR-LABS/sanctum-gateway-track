/**
 * Wallet Monitoring API
 *
 * Endpoints for managing wallet monitoring
 */

import express, { Request, Response } from 'express';
import { getWalletMonitorService } from '../services/wallet-monitor.js';

const router = express.Router();

/**
 * POST /api/monitor/wallet
 * Start monitoring a wallet address
 */
router.post('/wallet', async (req: Request, res: Response) => {
  try {
    const { wallet_address } = req.body;

    if (!wallet_address || typeof wallet_address !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'wallet_address is required and must be a string',
      });
    }

    const monitorService = getWalletMonitorService();
    const result = await monitorService.addWallet(wallet_address);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('[API] Error starting wallet monitoring:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * DELETE /api/monitor/wallet/:address
 * Stop monitoring a wallet address
 */
router.delete('/wallet/:address', (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'wallet address is required',
      });
    }

    const monitorService = getWalletMonitorService();
    const removed = monitorService.removeWallet(address);

    if (removed) {
      return res.status(200).json({
        success: true,
        message: 'Wallet monitoring stopped',
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found in monitoring list',
      });
    }
  } catch (error) {
    console.error('[API] Error stopping wallet monitoring:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

/**
 * GET /api/monitor/wallets
 * Get list of monitored wallets
 */
router.get('/wallets', (_req: Request, res: Response) => {
  try {
    const monitorService = getWalletMonitorService();
    const wallets = monitorService.getMonitoredWallets();

    return res.status(200).json({
      success: true,
      wallets,
      count: wallets.length,
    });
  } catch (error) {
    console.error('[API] Error getting monitored wallets:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

export default router;
