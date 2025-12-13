'use client';

import * as React from 'react';
import { Coins, TrendingUp, Award, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface RewardsPanelProps {
  credits?: number;
  boostedCredits?: number;
  networkShare?: number;
  estimatedRewards?: {
    perEpoch: number;
    perMonth: number;
    perYear: number;
  };
  boosts?: Array<{ name: string; multiplier: number }>;
}

export function RewardsPanel({
  credits = 1000,
  boostedCredits = 16000,
  networkShare = 0.05,
  estimatedRewards = {
    perEpoch: 0.5,
    perMonth: 150,
    perYear: 1800,
  },
  boosts = [
    { name: 'Deep South Era', multiplier: 16 },
    { name: 'Titan NFT', multiplier: 11 },
  ],
}: RewardsPanelProps) {
  const totalMultiplier = boosts.reduce((acc, boost) => acc * boost.multiplier, 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Credits & Rewards
        </CardTitle>
        <CardDescription>Performance-based earnings and multipliers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Credits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Base Credits</span>
            <span className="text-2xl font-bold">{formatNumber(credits)}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Boosted Credits</span>
            </div>
            <span className="text-xl font-bold text-primary">{formatNumber(boostedCredits)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Multiplier</span>
            <span className="font-medium">{totalMultiplier}x</span>
          </div>
        </div>

        <Separator />

        {/* Active Boosts */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Active Boosts</h4>
          <div className="space-y-2">
            {boosts.map((boost) => (
              <div
                key={boost.name}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{boost.name}</span>
                </div>
                <Badge variant="secondary">{boost.multiplier}x</Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Network Share */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network Share</span>
            <span className="text-lg font-bold">{networkShare.toFixed(4)}%</span>
          </div>
          <Progress value={networkShare * 20} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Your share of total network boosted credits
          </p>
        </div>

        <Separator />

        {/* Estimated Rewards */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-medium">Estimated Rewards</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Per Epoch (2 days)</span>
              <span className="font-medium">{formatCurrency(estimatedRewards.perEpoch)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Per Month</span>
              <span className="font-medium">{formatCurrency(estimatedRewards.perMonth)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Per Year</span>
              <span className="text-xl font-bold">{formatCurrency(estimatedRewards.perYear)}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <p>
            * Estimated rewards based on current network conditions and performance. Actual rewards
            may vary.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}