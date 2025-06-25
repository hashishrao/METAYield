'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const handleConnect = () => {
    // This is a mock connection.
    // In a real app, you would use a library like ethers.js or web3-react.
    setIsConnected(true);
    setAddress('0x1234...aBcd');
  };

  return isConnected ? (
    <Button variant="outline" className="font-mono">
      <Wallet className="mr-2" />
      {address}
    </Button>
  ) : (
    <Button onClick={handleConnect}>
      <Wallet className="mr-2" />
      Connect Wallet
    </Button>
  );
}
