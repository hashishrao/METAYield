'use client';

import { useSDK } from '@metamask/sdk-react';
import { Wallet, Check, ChevronDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatAddress } from '@/lib/utils';

const LINEA_CHAIN_ID = '0xe708'; // 59144 for Linea Mainnet
const BASE_CHAIN_ID = '0x2105'; // 8453 for Base Mainnet

const supportedChains = [
  {
    id: LINEA_CHAIN_ID,
    name: 'Linea',
    chainName: 'Linea Mainnet',
    nativeCurrency: { name: 'Linea Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.linea.build'],
    blockExplorerUrls: ['https://lineascan.build'],
  },
  {
    id: BASE_CHAIN_ID,
    name: 'Base',
    chainName: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
  },
];

export function ConnectWalletButton() {
  const { sdk, connected, connecting, account, chainId } = useSDK();

  const handleSwitchNetwork = async (newChainId: string) => {
    try {
      await sdk?.switchChain(newChainId);
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added to MetaMask
        const chainToAdd = supportedChains.find((c) => c.id === newChainId);
        if (chainToAdd) {
          try {
            await sdk?.addChain({
              chainId: chainToAdd.id,
              chainName: chainToAdd.chainName,
              nativeCurrency: chainToAdd.nativeCurrency,
              rpcUrls: chainToAdd.rpcUrls,
              blockExplorerUrls: chainToAdd.blockExplorerUrls,
            });
          } catch (addError) {
            console.error(`Failed to add ${chainToAdd.name} network`, addError);
          }
        }
      } else {
        console.error('Failed to switch network', error);
      }
    }
  };

  const handleConnect = async () => {
    try {
      await sdk?.connect();
      // useSDK's chainId might be stale, get it fresh
      const currentChainId = await sdk?.getChainId();
      if (currentChainId && currentChainId !== LINEA_CHAIN_ID) {
        // Prefer Linea on initial connect
        await handleSwitchNetwork(LINEA_CHAIN_ID);
      }
    } catch (err) {
      console.warn(`Failed to connect...`, err);
    }
  };

  const handleDisconnect = () => {
    sdk?.terminate();
  };

  const currentChain = supportedChains.find((c) => c.id === chainId);

  if (connected && account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-mono">
            <Wallet className="mr-2" />
            {currentChain?.name ?? 'Unsupported Network'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{formatAddress(account)}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Select Network</DropdownMenuLabel>
          {supportedChains.map((chain) => (
            <DropdownMenuItem
              key={chain.id}
              onClick={() => handleSwitchNetwork(chain.id)}
            >
              <div className="flex w-full items-center justify-between">
                <span>{chain.name}</span>
                {chainId === chain.id && <Check className="h-4 w-4" />}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="https://console.circle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              Circle Console
              <ExternalLink className="ml-auto h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={connecting}>
      <Wallet className="mr-2" />
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}
