import { WalletInputForm } from '@/components/wallet-monitor/wallet-input-form';
import { MonitoredWalletsList } from '@/components/wallet-monitor/monitored-wallets-list';
import { ExampleWallets } from '@/components/wallet-monitor/example-wallets';

export default function MonitorPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet Monitor</h1>
        <p className="text-muted-foreground mt-2">
          Monitor any Solana wallet address to track transactions and analyze Gateway usage in real-time
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WalletInputForm />

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">How it works</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-primary">1.</span>
                <span>Enter any valid Solana wallet address in the form</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">2.</span>
                <span>Our service starts monitoring the blockchain for transactions from that wallet</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">3.</span>
                <span>New transactions appear automatically in the dashboard with real-time updates</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">4.</span>
                <span>View detailed analytics, cost breakdowns, and success rates</span>
              </li>
            </ol>
          </div>

          <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
              Benefits
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• Monitor your own wallets or analyze others</li>
              <li>• Zero cost - all data is read-only from blockchain</li>
              <li>• Real-time updates via WebSocket</li>
              <li>• Comprehensive analytics and insights</li>
              <li>• No wallet connection or signatures required</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example Wallets */}
      <ExampleWallets />

      {/* Monitored Wallets List */}
      <MonitoredWalletsList />
    </div>
  );
}
