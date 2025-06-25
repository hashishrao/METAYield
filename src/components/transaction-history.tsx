import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Activity,
} from 'lucide-react';
import type { Transaction } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'Repayment',
    status: 'Success',
    description: 'USDC Auto-repayment for credit spending',
    amount: 750.5,
    date: '2024-07-20',
  },
  {
    id: '2',
    type: 'Yield',
    status: 'Success',
    description: 'Yield from Aave USDC pool',
    amount: 55.23,
    date: '2024-07-19',
  },
  {
    id: '3',
    type: 'Staking',
    status: 'Success',
    description: 'Staked 1.0 ETH on Compound',
    amount: 3200.0,
    date: '2024-07-18',
  },
  {
    id: '4',
    type: 'Repayment',
    status: 'Failed',
    description: 'Insufficient USDC yield for repayment',
    amount: 750.5,
    date: '2024-06-20',
  },
  {
    id: '5',
    type: 'Yield',
    status: 'Success',
    description: 'Yield from Compound ETH pool',
    amount: 120.45,
    date: '2024-06-19',
  },
];

const typeIcons = {
  Repayment: <ArrowDownLeft className="size-5 text-destructive" />,
  Staking: <ArrowUpRight className="size-5 text-positive" />,
  Yield: <ArrowDownLeft className="size-5 text-positive" />,
};

const statusIcons = {
  Success: (
    <CheckCircle2 className="size-5 text-positive" />
  ),
  Failed: <XCircle className="size-5 text-destructive" />,
};

export function TransactionHistory() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity />
          Transaction History
        </CardTitle>
        <CardDescription>
          Your recent repayments, staking, and yield activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockTransactions.map((tx) => (
            <li key={tx.id} className="flex items-center gap-4">
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full',
                  tx.type === 'Repayment' && 'bg-destructive/10',
                  tx.type === 'Staking' && 'bg-positive/10',
                  tx.type === 'Yield' && 'bg-positive/10'
                )}
              >
                {typeIcons[tx.type]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{tx.description}</p>
                  <p
                    className={cn(
                      'font-semibold',
                      tx.type === 'Repayment' ? 'text-destructive' : 'text-positive'
                    )}
                  >
                    {tx.type === 'Repayment' ? '-' : '+'}
                    {tx.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                   <Badge variant={tx.status === 'Success' ? 'secondary' : 'destructive'}>
                      {tx.status}
                   </Badge>
                  <span>
                    {new Date(tx.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
