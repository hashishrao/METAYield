'use client';

import { useSDK } from '@metamask/sdk-react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/utils';

const LINEA_CHAIN_ID = '0xe708'; // 59144 for Linea Mainnet

export function ConnectWalletButton() {
  const { sdk, connected, connecting, account, chainId } = useSDK();

  const handleSwitchNetwork = async () => {
    try {
      await sdk?.switchChain(LINEA_CHAIN_ID);
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await sdk?.addChain({
            chainId: LINEA_CHAIN_ID,
            chainName: 'Linea Mainnet',
            nativeCurrency: {
              name: 'Linea Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.linea.build'],
            blockExplorerUrls: ['https://lineascan.build'],
          });
        } catch (addError) {
          console.error('Failed to add Linea network', addError);
        }
      } else {
        console.error('Failed to switch to Linea network', error);
      }
    }
  };

  const handleConnect = async () => {
    try {
      await sdk?.connect();
      // useSDK's chainId might be stale, get it fresh
      const currentChainId = await sdk?.getChainId();
      if (currentChainId && currentChainId !== LINEA_CHAIN_ID) {
        await handleSwitchNetwork();
      }
    } catch (err) {
      console.warn(`Failed to connect...`, err);
    }
  };

  if (connected && account) {
    if (chainId !== LINEA_CHAIN_ID) {
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" className="font-mono" disabled>
            <Wallet className="mr-2" />
            {formatAddress(account)}
          </Button>
          <Button variant="destructive" onClick={handleSwitchNetwork}>
            Switch to Linea
          </Button>
        </div>
      );
    }
    return (
      <Button variant="outline" className="font-mono">
        <Wallet className="mr-2" />
        {formatAddress(account)}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={connecting}>
      <Wallet className="mr-2" />
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}
