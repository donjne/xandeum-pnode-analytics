'use client';

import * as React from 'react';
import { Calculator } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ERA_BOOSTS, NFT_BOOSTS, EraBoostName, NFTBoostName } from '@/lib/constants';
import { calculateBoostedCredits, calculateRewards } from '@/lib/utils';
import { formatNumber, formatCurrency } from '@/lib/utils';

export function RewardCalculator() {
  const [baseCredits, setBaseCredits] = React.useState('1000');
  const [totalNetworkCredits, setTotalNetworkCredits] = React.useState('100000');
  const [eraBoost, setEraBoost] = React.useState<EraBoostName | 'none'>('none');
  const [nftBoost, setNftBoost] = React.useState<NFTBoostName | 'none'>('none');

  const credits = parseFloat(baseCredits) || 0;
  const networkCredits = parseFloat(totalNetworkCredits) || 0;

  const boostedCredits = calculateBoostedCredits(
    credits,
    eraBoost === 'none' ? null : eraBoost,
    nftBoost === 'none' ? null : nftBoost
  );

  const rewards = calculateRewards(boostedCredits, networkCredits);

  return (
    <Card
      className="
        rounded-2xl border border-transparent
        bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]
        dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl
        dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
      "
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-500" />
          Reward Calculator
        </CardTitle>
        <CardDescription>
          Estimate rewards based on boosted credit share
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Inputs */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Base Credits</Label>
            <Input
              type="number"
              value={baseCredits}
              onChange={(e) => setBaseCredits(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Total Network Credits</Label>
            <Input
              type="number"
              value={totalNetworkCredits}
              onChange={(e) => setTotalNetworkCredits(e.target.value)}
            />
          </div>
        </div>

        {/* Boost selectors */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Era Boost</Label>
            <Select value={eraBoost} onValueChange={(v) => setEraBoost(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select era" />
              </SelectTrigger>
                  <SelectContent
                    className="
                      bg-white text-slate-900
                      shadow-xl border border-slate-200
                      dark:bg-[#0F1535]
                      dark:text-slate-100
                      dark:border-white/10
                    "
                  >
                <SelectItem value="none">None (1×)</SelectItem>
                {Object.entries(ERA_BOOSTS).map(([name, data]) => (
                  <SelectItem key={name} value={name}>
                    {name} ({data.multiplier}×)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>NFT Boost</Label>
            <Select value={nftBoost} onValueChange={(v) => setNftBoost(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select NFT" />
              </SelectTrigger>
                <SelectContent
                    className="
                      bg-white text-slate-900
                      shadow-xl border border-slate-200
                      dark:bg-[#0F1535]
                      dark:text-slate-100
                      dark:border-white/10
                    "
                  >
                <SelectItem value="none">None (1×)</SelectItem>
                {Object.entries(NFT_BOOSTS).map(([name, data]) => (
                  <SelectItem key={name} value={name}>
                    {name} ({data.multiplier}×)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Results */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Boosted Credits</p>
            <p className="text-2xl font-semibold">{formatNumber(boostedCredits)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Network Share</p>
            <p className="text-2xl font-semibold">
              {rewards.networkShare.toFixed(4)}%
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Per Epoch</span>
            <span className="font-medium">{formatCurrency(rewards.perEpoch)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Per Month</span>
            <span className="font-medium">{formatCurrency(rewards.perMonth)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Per Year</span>
            <span className="text-lg font-semibold">
              {formatCurrency(rewards.perYear)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
