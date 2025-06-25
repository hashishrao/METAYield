'use client';

import { MetaMaskProvider } from '@metamask/sdk-react';
import { Toaster } from './ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: 'METAYield',
          url: url,
        },
      }}
    >
      {children}
      <Toaster />
    </MetaMaskProvider>
  );
}
