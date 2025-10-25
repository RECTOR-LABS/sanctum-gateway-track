# Multi-Wallet Monitoring with 3-Wallet Limit

## Overview

Implemented multi-wallet monitoring with a configurable limit (default: 3 wallets) to prevent rate limit issues while enabling comparative analysis across multiple wallets.

## Implementation

### Backend Changes

#### 1. WalletMonitorService (`src/backend/services/wallet-monitor.ts`)

**New Constants**:
```typescript
private readonly MAX_WALLETS = parseInt(process.env.MAX_MONITORED_WALLETS || '3');
```

**Updated Methods**:
- `addWallet()` - Now checks if limit is reached before adding
  - Returns `currentCount` and `maxWallets` in response
  - Error message: "Maximum wallet limit reached (3 wallets). Please stop monitoring another wallet first."

- `getWalletStats()` - New method returning:
  ```typescript
  {
    currentCount: number;
    maxWallets: number;
    canAddMore: boolean;
  }
  ```

#### 2. Monitor API (`src/backend/api/monitor.ts`)

**Updated Endpoints**:
- `GET /api/monitor/wallets` - Now includes wallet stats:
  ```json
  {
    "success": true,
    "wallets": [...],
    "count": 2,
    "currentCount": 2,
    "maxWallets": 3,
    "canAddMore": true
  }
  ```

- `POST /api/monitor/wallet` - Returns count info on success/failure

### Frontend Changes

#### 1. MonitoredWalletsList Component

**New Features**:
- Badge showing "X/3 wallets" in header
  - Green (secondary) when slots available
  - Red (destructive) when limit reached
- Description text: "X of 3 wallet slots being used (limit reached)"
- Real-time updates when wallets added/removed

**State Management**:
```typescript
const [maxWallets, setMaxWallets] = useState(3);
const [canAddMore, setCanAddMore] = useState(true);
```

#### 2. WalletInputForm Component

**New Features**:
- Badge showing "X/3 slots" in header
- Warning message when limit reached
- Button disabled when `!canAddMore`
- Button text changes to "Limit Reached (3/3)"
- Fetches wallet stats on mount and after submission

**UI Changes**:
- CardDescription shows limit warning when full
- Toast includes count: "Now tracking ABC...XYZ (3/3)"

#### 3. ExampleWallets Component

**New Features**:
- Fetches wallet stats on mount
- Updates stats after adding wallet
- Buttons disabled when limit reached
- Button text changes to "Limit Reached"

## Rate Limit Calculation

With 3-wallet limit and current settings:
```
Poll interval: 60 seconds
Max transactions per poll: 5
Wallets: 3

Helius RPC calls per day:
= 3 wallets × 5 tx/poll × (86400 seconds / 60 seconds)
= 3 × 5 × 1440
= 21,600 calls/day

Free tier limit: 100,000 calls/day
Usage: 21.6% of free tier ✅ Safe
```

## Configuration

Add to `.env` to change limit:
```bash
MAX_MONITORED_WALLETS=3  # Default: 3
```

Higher limits calculation:
- 5 wallets: 36,000 calls/day (36% usage)
- 10 wallets: 72,000 calls/day (72% usage)
- 15 wallets: 108,000 calls/day (108% usage) ❌ Exceeds free tier

## User Experience

### Adding Wallet (Slots Available)
1. Badge shows "1/3 slots" (green)
2. Form shows count in header
3. "Start Monitoring" button enabled
4. Success toast: "Now tracking ABC...XYZ (2/3)"
5. Badge updates to "2/3 slots"

### Adding Wallet (Limit Reached)
1. Badge shows "3/3 wallets" (red)
2. Warning: "⚠️ Limit reached - stop monitoring a wallet to add another"
3. "Limit Reached (3/3)" button disabled
4. Example wallet buttons show "Limit Reached" and disabled

### Removing Wallet
1. Click "Stop" on monitored wallet
2. Success toast: "No longer tracking ABC...XYZ"
3. Badge updates to "2/3 wallets" (green)
4. Form re-enabled automatically

## Benefits

1. **Prevents Rate Limiting**: Stays safely under Helius free tier (21.6% usage)
2. **Comparative Analysis**: Monitor multiple wallet types simultaneously
3. **Educational**: See different use cases (DEX, MEV bot, whale)
4. **User-Friendly**: Clear visual indicators of limits
5. **Flexible**: Configurable via environment variable

## Testing Checklist

✅ Add wallet when slots available (0/3 → 1/3)
✅ Add wallet when limit reached (3/3) - shows error
✅ Remove wallet updates count (3/3 → 2/3)
✅ Badge color changes (green ↔ red)
✅ Button disabled state when limit reached
✅ Toast shows count after adding
✅ Example wallets disabled when limit reached
✅ TypeScript compilation passes
✅ Backend returns correct count in API responses

## Files Changed

### Backend (3 files)
1. `src/backend/services/wallet-monitor.ts` - Added MAX_WALLETS, limit validation, getWalletStats()
2. `src/backend/api/monitor.ts` - Updated /wallets endpoint to include stats

### Frontend (3 files)
1. `src/frontend/components/wallet-monitor/monitored-wallets-list.tsx` - Badge, count display
2. `src/frontend/components/wallet-monitor/wallet-input-form.tsx` - Limit indicator, fetch stats
3. `src/frontend/components/wallet-monitor/example-wallets.tsx` - Disabled state when limit reached

## Future Enhancements

Potential improvements:
1. Per-user limits (different limits for free/paid users)
2. Dynamic limit based on RPC tier
3. Wallet prioritization (pause low-priority wallets)
4. Historical wallet list (previously monitored)
5. Import/export wallet lists
6. Wallet groups/categories

---

**Created**: October 25, 2025
**Status**: ✅ Production Ready
**Rate Limit Safety**: ✅ 21.6% of Helius free tier (100k/day)
