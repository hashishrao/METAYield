import { ConnectWalletButton } from './connect-wallet-button';
import { LiveFeedDrawer } from './live-feed-drawer';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <LiveFeedDrawer />
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
