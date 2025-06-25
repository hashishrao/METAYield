import { Header } from '@/components/header';
import { RepaymentPlanner } from '@/components/repayment-planner';
import { TransactionHistory } from '@/components/transaction-history';
import { YieldDashboard } from '@/components/yield-dashboard';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-8 lg:col-span-2">
            <YieldDashboard />
            <TransactionHistory />
          </div>
          <div className="lg:col-span-1">
            <RepaymentPlanner />
          </div>
        </div>
      </main>
    </div>
  );
}
