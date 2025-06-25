'use client';

import { Wallet, ExternalLink } from 'lucide-react';
import type { Asset } from '@/lib/types';
import Link from 'next/link';
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
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Dot,
  ReferenceDot,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { subDays, format } from 'date-fns';

const mockAssets: Asset[] = [
  {
    name: 'USD Coin',
    symbol: 'USDC',
    balance: 10500.75,
    apy: 5.25,
    protocol: 'Aave',
    icon: <AaveIcon className="size-6" />,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    balance: 5.2,
    apy: 3.8,
    protocol: 'Compound',
    icon: <CompoundIcon className="size-6" />,
  },
  {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    balance: 2.1,
    apy: 4.1,
    protocol: 'Aave',
    icon: <AaveIcon className="size-6" />,
  },
];

const assetIcons: Record<Asset['symbol'], React.ReactNode> = {
  USDC: <UsdcIcon className="size-5 text-primary" />,
  ETH: <EthIcon className="size-5 text-foreground" />,
  WETH: <EthIcon className="size-5 text-foreground" />,
};

const generateChartData = (days: number) => {
  const data = [];
  let currentValue = 15000;
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    currentValue += (Math.random() - 0.45) * 200;
    let event: 'Staking' | 'Repayment' | undefined = undefined;
    if (i > 0 && Math.random() < 0.15) {
      if (Math.random() < 0.5) {
        event = 'Staking';
        currentValue += 1000;
      } else {
        event = 'Repayment';
        currentValue -= 750;
      }
    }
    data.push({
      date: format(date, 'MMM d'),
      value: Math.max(12000, currentValue),
      event,
    });
  }
  return data;
};

const chartData = {
  '1W': generateChartData(7),
  '1M': generateChartData(30),
  '3M': generateChartData(90),
};

const chartConfig = {
  value: {
    label: 'Portfolio Value',
    color: 'hsl(var(--primary))',
  },
  staking: {
    label: 'Staking',
    color: 'hsl(var(--positive))',
  },
  repayment: {
    label: 'Repayment',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export function YieldDashboard() {
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M'>('1M');

  const totalBalanceUSD = mockAssets.reduce((acc, asset) => {
    const price =
      asset.symbol === 'USDC'
        ? 1
        : asset.symbol === 'ETH' || asset.symbol === 'WETH'
          ? 3200
          : 0;
    return acc + asset.balance * price;
  }, 0);

  const totalMonthlyIncome = mockAssets.reduce((acc, asset) => {
    const price =
      asset.symbol === 'USDC'
        ? 1
        : asset.symbol === 'ETH' || asset.symbol === 'WETH'
          ? 3200
          : 0;
    const monthlyIncome = (asset.balance * price * (asset.apy / 100)) / 12;
    return acc + monthlyIncome;
  }, 0);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Wallet />
              Yield Dashboard
            </CardTitle>
            <CardDescription className="mt-2">
              Your portfolio growth, staked assets and their current yield.
            </CardDescription>
          </div>
          <Tabs
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as any)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid h-9 w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart
              accessibilityLayer
              data={chartData[timeRange]}
              margin={{
                left: 0,
                right: 12,
                top: 5,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value, index) => {
                  if (timeRange === '3M' && index % 10 !== 0) return '';
                  if (timeRange === '1M' && index % 6 !== 0) return '';
                  return value;
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    labelClassName="font-bold"
                    formatter={(value, name, item) => (
                      <>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                            style={{
                              backgroundColor: chartConfig.value.color,
                            }}
                          />
                          <div className="flex flex-1 justify-between">
                            <span className="text-muted-foreground">
                              Portfolio Value
                            </span>
                            <span className="font-bold">
                              {value.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })}
                            </span>
                          </div>
                        </div>
                        {item.payload.event && (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                              style={{
                                backgroundColor:
                                  item.payload.event === 'Staking'
                                    ? 'hsl(var(--positive))'
                                    : 'hsl(var(--destructive))',
                              }}
                            />
                            <div className="flex flex-1 justify-between">
                              <span className="text-muted-foreground">
                                {item.payload.event}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    indicator="dot"
                  />
                }
              />
              <defs>
                <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="value"
                type="natural"
                fill="url(#fillValue)"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                }}
              />
              {chartData[timeRange].map(
                (point, index) =>
                  point.event && (
                    <ReferenceDot
                      key={index}
                      x={point.date}
                      y={point.value}
                      r={5}
                      fill={
                        point.event === 'Staking'
                          ? 'hsl(var(--positive))'
                          : 'hsl(var(--destructive))'
                      }
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  )
              )}
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border p-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Staked Value</p>
            <p className="text-2xl font-bold">
              {totalBalanceUSD.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Projected Monthly Income
            </p>
            <p className="text-2xl font-bold text-positive">
              +{' '}
              {totalMonthlyIncome.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
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
              const monthlyIncome =
                (asset.balance * price * (asset.apy / 100)) / 12;
              return (
                <TableRow key={asset.symbol + asset.protocol}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                        {assetIcons[asset.symbol]}
                      </div>
                      <div>
                        {asset.name}
                        <span className="ml-2 text-muted-foreground">
                          {asset.symbol}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={
                        asset.protocol === 'Aave'
                          ? 'https://aave.com/'
                          : 'https://compound.finance/'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:underline"
                    >
                      {asset.icon}
                      <span>{asset.protocol}</span>
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-medium text-positive">
                    {asset.apy.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {asset.balance.toLocaleString()} {asset.symbol}
                  </TableCell>
                  <TableCell className="text-right text-positive">
                    +
                    {monthlyIncome.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
