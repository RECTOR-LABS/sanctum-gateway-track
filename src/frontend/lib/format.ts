import { DeliveryMethod, TransactionStatus } from './types';

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

/**
 * Format SOL amount with proper decimals
 */
export function formatSol(lamports: number, decimals: number = 6): string {
  return lamportsToSol(lamports).toFixed(decimals);
}

/**
 * Format SOL amount intelligently (compact for small numbers)
 * - For amounts >= 0.001 SOL: show 6 decimals (e.g., "0.005432 SOL")
 * - For amounts < 0.001 SOL: show in lamports (e.g., "89,000 lamports")
 * - For zero: show "0 SOL"
 */
export function formatSolSmart(lamports: number): string {
  if (lamports === 0) return '0 SOL';

  const sol = lamportsToSol(lamports);

  // For amounts >= 0.001 SOL (1 million lamports), show in SOL
  if (sol >= 0.001) {
    return `${sol.toFixed(6)} SOL`;
  }

  // For smaller amounts, show in lamports with comma separators
  return `${lamports.toLocaleString()} lamports`;
}

/**
 * Format SOL amount for cost displays (single line, no wrapping)
 * - Uses compact notation for very small numbers
 * - Example: 0.000089 SOL → "89 μSOL" (micro-SOL)
 */
export function formatSolCompact(lamports: number): string {
  if (lamports === 0) return '0 SOL';

  const sol = lamportsToSol(lamports);

  // >= 0.1 SOL: show with 4 decimals
  if (sol >= 0.1) {
    return `${sol.toFixed(4)} SOL`;
  }

  // >= 0.001 SOL: show with 6 decimals
  if (sol >= 0.001) {
    return `${sol.toFixed(6)} SOL`;
  }

  // < 0.001 SOL: show in microSOL (μSOL = SOL × 1,000,000)
  const microSol = sol * 1_000_000;
  if (microSol >= 0.1) {
    return `${microSol.toFixed(2)} μSOL`;
  }

  // Very tiny amounts: show in nanoSOL (nSOL = SOL × 1,000,000,000 = lamports)
  return `${lamports} nSOL`;
}

/**
 * Format transaction signature (truncate middle)
 */
export function formatSignature(signature: string, length: number = 16): string {
  if (signature.length <= length) return signature;
  const half = Math.floor(length / 2);
  return `${signature.slice(0, half)}...${signature.slice(-half)}`;
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
}

/**
 * Format absolute timestamp
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

/**
 * Get status badge color
 */
export function getStatusColor(status: TransactionStatus): string {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'failed':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
}

/**
 * Get delivery method badge color
 */
export function getDeliveryMethodColor(method: DeliveryMethod): string {
  switch (method) {
    case 'jito':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'rpc':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'sanctum-sender':
      return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
}

/**
 * Get delivery method display name
 */
export function getDeliveryMethodName(method: DeliveryMethod): string {
  switch (method) {
    case 'jito':
      return 'Jito';
    case 'rpc':
      return 'RPC';
    case 'sanctum-sender':
      return 'Sanctum';
    default:
      return 'Without Gateway';
  }
}
