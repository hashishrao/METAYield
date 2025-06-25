'use client';

import { Gift, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function UnlockableRewards() {
  // Mock data for progress
  const repaidAmount = 450;
  const targetAmount = 1000;
  const progressPercentage = (repaidAmount / targetAmount) * 100;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="text-primary" />
          Unlockable Rewards
        </CardTitle>
        <CardDescription>
          Complete challenges to earn exclusive attestations and NFTs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <Image
            src="https://i.postimg.cc/8cJ19v9g/nft-badge.png"
            alt="NFT Badge"
            width={80}
            height={80}
            className="rounded-md"
          />
          <div className="flex-1 space-y-3">
            <p className="font-semibold">
              Auto-repay ${targetAmount.toLocaleString()}+ in 30 days to unlock an NFT badge.
            </p>
            <div className="space-y-2">
               <div className="flex justify-between text-sm font-medium">
                <span>Progress</span>
                <span className="text-muted-foreground">${repaidAmount.toLocaleString()} / ${targetAmount.toLocaleString()}</span>
              </div>
              <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% complete`} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
             <Button variant="link" asChild>
                <Link href="#">
                    <ShieldCheck className="mr-2" />
                    View Attestation
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
