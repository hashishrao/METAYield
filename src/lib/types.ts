import type { ReactNode } from "react";

export type Asset = {
  name: 'USD Coin' | 'Ethereum' | 'Wrapped Ether';
  symbol: 'USDC' | 'ETH' | 'WETH';
  balance: number;
  apy: number;
  protocol: 'Aave' | 'Compound';
  icon: ReactNode;
};

export type Transaction = {
  id: string;
  type: 'Repayment' | 'Staking' | 'Yield';
  status: 'Success' | 'Failed';
  description: string;
  amount: number;
  date: string;
};
