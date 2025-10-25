# Example Wallets Feature

## Overview

Added one-click monitoring for 5 curated example wallets on the `/monitor` page to help users quickly discover active Solana wallets worth monitoring.

## Implementation

### New Component: ExampleWallets

**File**: `src/frontend/components/wallet-monitor/example-wallets.tsx`

**Features**:
- 5 pre-selected active Solana wallets
- One-click "Monitor" button for each wallet
- Activity level indicators (Very High 🔥, High ⚡, Moderate 📊)
- Wallet descriptions and categorization
- Toast notifications on success/error
- Loading states during API calls

### Example Wallets Included

1. **Sanctum Gateway Demo** (Moderate Activity)
   - Address: `REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc`
   - Description: Our demo wallet with 11 successful Gateway transactions
   - Best for: Testing and understanding Gateway integration

2. **Jupiter Aggregator** (Very High Activity)
   - Address: `JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4`
   - Description: Processes thousands of swaps daily
   - Best for: Seeing real-time high-frequency activity

3. **Raydium AMM** (Very High Activity)
   - Address: `675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8`
   - Description: Major DEX protocol with continuous trading
   - Best for: Observing DeFi protocol patterns

4. **MEV Trading Bot** (High Activity)
   - Address: `9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM`
   - Description: High-frequency arbitrage bot
   - Best for: Understanding MEV and bot strategies

5. **Whale Wallet** (Moderate Activity)
   - Address: `GThUX1Atko4tqhN2NaiTazWSeFWMuiUvfFnyJyUghFMJ`
   - Description: Large holder with regular trading
   - Best for: Tracking whale movements

## User Experience

### Visual Indicators

- **Activity Level Colors**:
  - Very High: Red (🔥 icon)
  - High: Orange (⚡ icon)
  - Moderate: Green (📊 icon)

- **Card Layout**:
  - Wallet label (bold)
  - Activity indicator (colored badge)
  - Description text
  - Full wallet address (code format)
  - "Monitor" button (right-aligned)

### Interactions

1. **Click "Monitor" button** → API call to `/api/monitor/wallet`
2. **Success** → Toast notification with shortened address
3. **Error** → Error toast with failure reason
4. **During request** → Button shows "Starting..." and is disabled

### Toast Notifications

**Success Example**:
```
✓ Monitoring Started
Now tracking Jupiter Aggregator (JUP6LkbZ...NyVTaV4)
```

**Error Example**:
```
✗ Failed to Start Monitoring
Wallet already being monitored
```

## Benefits

1. **Instant Onboarding**: Users don't need to find active wallets themselves
2. **Educational**: Each wallet teaches different Solana use cases
3. **Varied Activity**: From moderate to very high frequency
4. **Zero Friction**: One click to start monitoring
5. **Smart Recommendations**: Tip box suggests best wallets for different goals

## Technical Details

### Component Props

```typescript
interface ExampleWalletsProps {
  onWalletMonitored?: (address: string) => void; // Optional callback when monitoring starts
}
```

### State Management

- `monitoringWallet: string | null` - Tracks which wallet is currently being added
- Prevents duplicate requests
- Handles loading states per wallet

### API Integration

- Endpoint: `POST /api/monitor/wallet`
- Body: `{ wallet_address: string }`
- Response: Success/Error with message
- Toast feedback for all outcomes

## Integration

Added to `/monitor` page:
```tsx
import { ExampleWallets } from '@/components/wallet-monitor/example-wallets';

// In page component
<ExampleWallets />
```

## Future Enhancements

Potential improvements:
1. Add more wallets (NFT traders, validators, DAOs)
2. Category filtering (DeFi, Trading, Infrastructure)
3. Live activity preview (transactions in last 24h)
4. Search/filter within examples
5. User-contributed wallet suggestions
6. Activity level auto-updated from blockchain data

## Files Changed

1. **Created**: `src/frontend/components/wallet-monitor/example-wallets.tsx` (176 lines)
2. **Modified**: `src/frontend/app/monitor/page.tsx` (added import and component)
3. **Fixed**: `src/frontend/components/transactions/real-time-feed.tsx` (status type fix)

## Testing

✅ TypeScript compilation passes (strict mode)
✅ All imports resolve correctly
✅ Component renders without errors
✅ Toast notifications work as expected
✅ API integration functional

---

**Created**: October 25, 2025
**Status**: ✅ Production Ready
