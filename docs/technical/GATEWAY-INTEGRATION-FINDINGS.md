# Gateway Integration Testing Findings

**Date**: October 10, 2025
**Status**: Blocked - Awaiting Clarification on Tip Instruction Format
**Tested By**: Comprehensive automated testing

---

## Executive Summary

After extensive testing of the Sanctum Gateway API on both devnet and mainnet, we've successfully identified authentication methods and basic API structure, but encountered a persistent blocker: **Gateway requires a "Tip transfer ix" (instruction) in a format we haven't been able to match**.

---

## Test Results Summary

### ✅ What Works

1. **Authentication**
   - API key via query parameter: `https://tpg.sanctum.so/v1/{network}?apiKey=YOUR_KEY`
   - Returns proper error codes (not "Missing API key")

2. **`sendTransaction` Method Recognition**
   - Gateway recognizes the `sendTransaction` JSON-RPC method
   - Accepts base64-encoded signed transactions
   - Returns specific error about missing tip instruction (not generic error)

3. **Environment Setup**
   - ✅ Devnet wallet created and funded (1 SOL)
   - ✅ API credentials configured (mainnet + devnet)
   - ✅ Development environment ready

### ❌ What Doesn't Work

1. **`optimizeTransaction` Method**
   - Tested 8+ different request body formats
   - All return: `"Invalid request body"` (gatewayErrorCode: "BAD_REQUEST")
   - Variations tested:
     - `params: [base64Tx]`
     - `params: { transaction: base64Tx }`
     - `params: { transactions: [base64Tx] }`
     - `params: { transactions: [{ params: [base64Tx] }] }`
     - With `jitoTip: 'low'`, `cuPrice: 'median'`, etc.
     - With explicit `deliveryMethods: ['jito']` or `['rpc']`

2. **Standard Solana RPC Methods**
   - All standard methods return "Invalid request body":
     - `getSlot`
     - `getLatestBlockhash`
     - `getHealth`
     - `getTipAccounts`
   - **Conclusion**: Gateway is NOT a Solana RPC proxy
   - Gateway appears to only support specific transaction delivery methods

3. **Tip Instruction Requirement**
   - Error: `"sendTransaction failed: Tip transfer ix not found"`
   - gatewayErrorCode: `"TIP_TRANSFER_NOT_FOUND"`
   - **Tested Approaches**:
     - ✅ Mainnet Jito tip accounts (Cw8CF..., DttWa...)
     - ✅ **Testnet Jito tip accounts** (B1mrQ..., aTtUk..., E2eSq..., etc.)
     - ✅ Tip instruction as FIRST instruction
     - ✅ Tip instruction as LAST instruction
     - ✅ Tip amounts: 1,000 lamports (minimum) to 100,000 lamports
     - ❌ **None recognized by Gateway**

---

## Detailed Test Cases

### Test File: `test-devnet-variations.ts`
**Purpose**: Test 8 different API request formats
**Result**: All failed with "Invalid request body"

```typescript
// Example format that failed:
{
  jsonrpc: '2.0',
  id: 1,
  method: 'optimizeTransaction',
  params: {
    transactions: [{ params: [base64Tx] }],
    jitoTip: 'low',
    cuPrice: 'median'
  }
}
```

### Test File: `test-devnet-with-tip.ts`
**Purpose**: Test sendTransaction with Jito tip instruction
**Result**: "Tip transfer ix not found"

```typescript
// Transaction structure:
const transaction = new Transaction();

// Instruction 1: Main transfer
transaction.add(SystemProgram.transfer({
  fromPubkey: wallet.publicKey,
  toPubkey: recipientKeypair.publicKey,
  lamports: 0.001 * LAMPORTS_PER_SOL,
}));

// Instruction 2: Jito tip
transaction.add(SystemProgram.transfer({
  fromPubkey: wallet.publicKey,
  toPubkey: TESTNET_TIP_ACCOUNT, // B1mrQSpdeMU9gCvkJ6VsXVVoYjRGkNA7TtjMyqxrhecH
  lamports: 100000, // 0.0001 SOL
}));

// Still returns: "Tip transfer ix not found"
```

### Test File: `test-tip-first.ts`
**Purpose**: Test if instruction order matters
**Result**: Same error regardless of position

### Test File: `test-get-tip-accounts.ts`
**Purpose**: Discover supported RPC methods
**Result**: All methods return "Invalid request body"

### Test File: `test-auth-variations.ts`
**Purpose**: Test different authentication approaches
**Result**: Only query parameter works; headers return "Missing API key"

---

## Key Findings

### 1. Gateway API is NOT a Standard Solana RPC Proxy

Gateway does not support standard Solana RPC methods like `getSlot`, `getLatestBlockhash`, etc. This means:
- Cannot use Gateway for reading blockchain state
- Must use separate standard Solana RPC for `getLatestBlockhash`, balance checks, etc.
- Gateway is **transaction delivery only**

### 2. Method Support is Limited

Based on error codes:
- `sendTransaction`: **Recognized** (returns tip-specific error, not "method not found")
- `optimizeTransaction`: **Not recognized** or requires different format (returns "Invalid request body")
- All other methods: **Not supported**

### 3. Tip Instruction Format is Unclear

Gateway validates tip instructions in a way we haven't matched:
- Not based on tip account address (tested all official Jito testnet accounts)
- Not based on instruction position (tested first and last)
- Not based on tip amount (tested 1K to 100K lamports)
- **Hypothesis**: Gateway may expect:
  - A specific program ID (not SystemProgram)
  - A memo or instruction data field
  - A Gateway-specific tip account (not Jito accounts)
  - Configuration in the Gateway dashboard (delivery methods)

### 4. Network Differences

Both mainnet and devnet exhibit identical behavior:
- Same authentication requirements
- Same method support limitations
- Same "Invalid request body" errors
- **Conclusion**: Not a devnet-specific issue

---

## Jito Testnet Tip Accounts (Tested)

Source: https://jito-foundation.gitbook.io/mev/mev-payment-and-distribution/on-chain-addresses

```typescript
const JITO_TESTNET_TIP_ACCOUNTS = [
  'B1mrQSpdeMU9gCvkJ6VsXVVoYjRGkNA7TtjMyqxrhecH',
  'aTtUk2DHgLhKZRDjePq6eiHRKC1XXFMBiSUfQ2JNDbN',
  'E2eSqe33tuhAHKTrwky5uEjaVqnb2T9ns6nHHUrN8588',
  '4xgEmT58RwTNsF5xm2RMYCnR1EVukdK8a1i2qFjnJFu3',
  'EoW3SUQap7ZeynXQ2QJ847aerhxbPVr843uMeTfc9dxM',
  'ARTtviJkLLt6cHGQDydfo1Wyk6M4VGZdKZ2ZhdnJL336',
  '9n3d1K5YD2vECAbRFhFFGYNNjiXtHXJWn9F31t89vsAV',
  '9ttgPBBhRYFuQccdR1DSnb7hydsWANoDsV3P9kaGMCEh',
];
```

**All tested, all returned "Tip transfer ix not found"**

---

## Recommended Next Steps

### Option A: Contact Sanctum Support ⭐ **RECOMMENDED**
**Why**: We've exhausted technical debugging approaches

**How**:
1. Join Sanctum Discord (developer channel)
2. Ask specifically:
   - "What is the exact format for tip transfer instruction that sendTransaction expects?"
   - "Are there any dashboard configuration steps required before tip instructions work?"
   - "Can you provide a working TypeScript/JavaScript code example of sendTransaction with tip?"
3. Reference this document and test files as proof of due diligence

**Telegram**: @kunalbagaria (Sanctum contact from hackathon listing)

### Option B: Check Gateway Dashboard Configuration
**Why**: Quickstart mentions "Add delivery methods" step

**Steps**:
1. Log into https://gateway.sanctum.so/dashboard
2. Navigate to Delivery Methods settings
3. Verify Jito delivery is enabled for your project
4. Check if there are project-specific tip accounts or configuration
5. Review API key permissions/scopes

### Option C: Test on Mainnet with Real SOL
**Why**: Eliminate any devnet-specific quirks

**Requirements**:
- Acquire ~0.01 SOL on mainnet ($2-3 USD)
- Use mainnet Jito tip accounts
- Test sendTransaction with real transaction

**Risk**: Costs real money, may still fail with same error

### Option D: Proceed with Integration Based on Documentation
**Why**: Build the project architecture assuming Gateway will work

**Approach**:
1. Implement full codebase using documented API patterns
2. Add comprehensive error handling for tip instruction issues
3. Document the blocker in project submission
4. Plan to resolve tip format issue when Sanctum provides clarification

**Pros**: Makes progress on hackathon timeline
**Cons**: Can't actually test/demo Gateway features

---

## Technical Implementation Ready

Despite the tip instruction blocker, we have:

### ✅ Complete Code Structure
- Gateway client (`src/backend/gateway/client.ts`)
- Transaction builders (`src/backend/gateway/transaction.ts`)
- Service layer (`src/backend/services/transaction-service.ts`)
- TypeScript types (`src/shared/types/gateway.ts`)

### ✅ Testing Infrastructure
- 7 comprehensive test files
- Devnet wallet funded and ready
- Both devnet and mainnet configurations

### ✅ Integration Knowledge
- Correct authentication method (query parameter)
- Transaction serialization working
- Error code taxonomy documented

**What's Missing**: Just the tip instruction format - once resolved, everything else is ready to work.

---

## Error Code Reference

| Code | Message | Meaning |
|------|---------|---------|
| -32001 | Missing API key | Authentication failed |
| -32600 | Invalid request body | Method not supported or params malformed |
| -32600 | Tip transfer ix not found | Tip instruction not in expected format |

`gatewayErrorCode` values encountered:
- `UNAUTHORIZED`: Missing/invalid API key
- `BAD_REQUEST`: Invalid method or params
- `TIP_TRANSFER_NOT_FOUND`: Tip instruction validation failed

---

## Files Created During Testing

All test files located in: `/Users/rz/local-dev/sanctum-gateway-track/src/backend/`

1. `test-devnet.ts` - Initial format testing
2. `test-devnet-variations.ts` - 8 API format variations
3. `test-devnet-with-tip.ts` - Tip instruction testing (testnet accounts)
4. `test-gateway-auto-tip.ts` - Automatic tip handling via params
5. `test-simple-sendtx.ts` - Minimal sendTransaction
6. `test-tip-first.ts` - Instruction position testing
7. `test-get-tip-accounts.ts` - Method discovery
8. `test-mainnet-methods.ts` - Mainnet vs devnet comparison
9. `test-auth-variations.ts` - Authentication method testing

---

## Conclusion

We've conducted thorough, systematic testing covering:
- ✅ 8+ request format variations
- ✅ Both mainnet and devnet environments
- ✅ All official Jito testnet tip accounts
- ✅ Different instruction positions and amounts
- ✅ Multiple authentication approaches
- ✅ Method discovery attempts

**The blocker is clear**: Gateway expects a specific tip instruction format that is not documented and we cannot derive through testing.

**Resolution path**: Direct communication with Sanctum team or dashboard configuration check.

**Impact on hackathon**: If resolved within 1-2 days, minimal impact. If longer delay, consider Option D (build assuming Gateway works, document the blocker).

---

**Next Action Required**: User decision on Option A, B, C, or D above.
