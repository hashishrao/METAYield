import { Wallet } from 'lucide-react';
import type { Asset } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AaveIcon, CompoundIcon, EthIcon, UsdcIcon } from './icons';

const mockAssets: Asset[] = [
  {
    name: 'USD Coin',
    symbol: 'USDC',
    balance: 10500.75,
    apy: 5.25,
    protocol: 'Aave',
    icon: <AaveIcon className="size-6 text-[#B6509E]" />,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    balance: 5.2,
    apy: 3.8,
    protocol: 'Compound',
    icon: <CompoundIcon className="size-6 text-[#00D395]" />,
  },
  {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    balance: 2.1,
    apy: 4.1,
    protocol: 'Aave',
    icon: <AaveIcon className="size-6 text-[#B6509E]" />,
  },
];

const assetIcons = {
  USDC: <UsdcIcon className="size-5 text-primary" />,
  ETH: <EthIcon className="size-5 text-foreground" />,
  WETH: <EthIcon className="size-5 text-foreground" />,
};

export function YieldDashboard() {
  const totalBalanceUSD = mockAssets.reduce((acc, asset) => {
    // Dummy prices for calculation
    const price = asset.symbol === 'USDC' ? 1 : asset.symbol === 'ETH' || asset.symbol === 'WETH' ? 3200 : 0;
    return acc + asset.balance * price;
  }, 0);

  const totalMonthlyIncome = mockAssets.reduce((acc, asset) => {
    const price = asset.symbol === 'USDC' ? 1 : asset.symbol === 'ETH' || asset.symbol === 'WETH' ? 3200 : 0;
    const monthlyIncome = (asset.balance * price * (asset.apy / 100)) / 12;
    return acc + monthlyIncome;
  }, 0);


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet />
          Yield Dashboard
        </CardTitle>
        <CardDescription>
          Your staked assets and their current yield.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border p-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Staked Value</p>
            <p className="text-2xl font-bold">
              {totalBalanceUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Projected Monthly Income</p>
            <p className="text-2xl font-bold text-green-600">
             + {totalMonthlyIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead className="text-right">APY</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Monthly Income</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAssets.map((asset) => {
                const price = asset.symbol === 'USDC' ? 1 : 3200;
                const monthlyIncome = (asset.balance * price * (asset.apy / 100)) / 12;
                return (
                  <TableRow key={asset.symbol + asset.protocol}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                           {assetIcons[asset.symbol]}
                        </div>
                        <div>
                         {asset.name}
                         <span className="ml-2 text-muted-foreground">{asset.symbol}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {asset.icon}
                        <span>{asset.protocol}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {asset.apy.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {asset.balance.toLocaleString()} {asset.symbol}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      +
                      {monthlyIncome.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                  </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
