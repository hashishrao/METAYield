'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, AreaChart, Briefcase } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type TickerData = {
  name: string;
  price: number;
  prevPrice: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'neutral';
};

const initialCryptoData: TickerData[] = [
  { name: 'ETH', price: 3200.50, prevPrice: 3200.50, change: 0, changePercent: 0, direction: 'neutral' },
  { name: 'WETH', price: 3200.45, prevPrice: 3200.45, change: 0, changePercent: 0, direction: 'neutral' },
  { name: 'USDC', price: 1.00, prevPrice: 1.00, change: 0, changePercent: 0, direction: 'neutral' },
];

const initialStockData: TickerData[] = [
  { name: 'NASDAQ', price: 17850.21, prevPrice: 17850.21, change: 0, changePercent: 0, direction: 'neutral' },
  { name: 'S&P 500', price: 5300.75, prevPrice: 5300.75, change: 0, changePercent: 0, direction: 'neutral' },
  { name: 'TSLA', price: 175.88, prevPrice: 175.88, change: 0, changePercent: 0, direction: 'neutral' },
  { name: 'AAPL', price: 212.45, prevPrice: 212.45, change: 0, changePercent: 0, direction: 'neutral' },
];

const TickerItem = ({ ticker }: { ticker: TickerData }) => {
  const isUp = ticker.direction === 'up';
  const isDown = ticker.direction === 'down';

  return (
    <div className="flex items-center justify-between py-2">
      <div className="font-medium">{ticker.name}</div>
      <div className="flex flex-col items-end">
        <div className="font-semibold">
            {ticker.name === 'USDC' ? `$${ticker.price.toFixed(4)}` : ticker.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </div>
        <div className={cn(
          'text-sm font-medium flex items-center',
          isUp && 'text-positive',
          isDown && 'text-destructive',
        )}>
          {isUp && <TrendingUp className="size-4 mr-1" />}
          {isDown && <TrendingDown className="size-4 mr-1" />}
          {ticker.direction === 'neutral' && <Minus className="size-4 mr-1" />}
          <span>{ticker.change.toFixed(ticker.name === 'USDC' ? 4 : 2)} ({ticker.changePercent.toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  );
};

export function LiveFeedDrawer() {
  const [cryptoData, setCryptoData] = useState(initialCryptoData);
  const [stockData, setStockData] = useState(initialStockData);

  useEffect(() => {
    const interval = setInterval(() => {
      const updateTicker = (ticker: TickerData): TickerData => {
        
        // For USDC, keep it stable
        if (ticker.name === 'USDC') {
            const smallFluctuation = (Math.random() - 0.5) * 0.0002; // very small change
            const usdcPrice = 1.00 + smallFluctuation;
            const change = usdcPrice - ticker.price;
             return {
                ...ticker,
                price: usdcPrice,
                prevPrice: ticker.price,
                change: change,
                changePercent: change * 100,
                direction: change > 0 ? 'up' : (change < 0 ? 'down' : 'neutral'),
            }
        }
        
        const randomFactor = (Math.random() - 0.5) * 0.01; // +/- 0.5% change
        const newPrice = ticker.price * (1 + randomFactor);
        const change = newPrice - ticker.price;
        const changePercent = (change / ticker.price) * 100;
        let direction: 'up' | 'down' | 'neutral' = 'neutral';
        if (change > 0.01) direction = 'up';
        if (change < -0.01) direction = 'down';

        return {
          ...ticker,
          price: newPrice,
          prevPrice: ticker.price,
          change,
          changePercent,
          direction,
        };
      };

      setCryptoData(prevData => prevData.map(updateTicker));
      setStockData(prevData => prevData.map(updateTicker));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <AreaChart className="size-5" />
          <span className="sr-only">Open Live Feed</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xs">
        <SheetHeader>
          <SheetTitle>Live Market Feed</SheetTitle>
          <SheetDescription>
            Real-time prices for crypto and stock markets. Data updates every 5 seconds.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-6">
            <div>
                <h3 className="mb-2 text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="size-5" />
                    Crypto
                </h3>
                <div className="divide-y">
                    {cryptoData.map(ticker => <TickerItem key={ticker.name} ticker={ticker} />)}
                </div>
            </div>
            <Separator />
            <div>
                <h3 className="mb-2 text-lg font-semibold flex items-center gap-2">
                    <AreaChart className="size-5" />
                    Stocks
                </h3>
                 <div className="divide-y">
                    {stockData.map(ticker => <TickerItem key={ticker.name} ticker={ticker} />)}
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}