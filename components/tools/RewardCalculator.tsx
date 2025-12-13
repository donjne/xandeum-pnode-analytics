import * as React from 'react';
import { Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <CardTitle>Reward Calculator</CardTitle>
        </div>
        <CardDescription>
          Calculate estimated XAND rewards based on credits and boost multipliers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="baseCredits">Base Credits</Label>
            <Input
              id="baseCredits"
              type="number"
              value={baseCredits}
              onChange={(e) => setBaseCredits(e.target.value)}
              placeholder="1000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="networkCredits">Total Network Credits</Label>
            <Input
              id="networkCredits"
              type="number"
              value={totalNetworkCredits}
              onChange={(e) => setTotalNetworkCredits(e.target.value)}
              placeholder="100000"
            />
          </div>
        </div>

        {/* Boosts */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="eraBoost">Era Boost</Label>
            <Select value={eraBoost} onValueChange={(v) => setEraBoost(v as any)}>
              <SelectTrigger id="eraBoost">
                <SelectValue placeholder="Select era" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (1x)</SelectItem>
                {Object.entries(ERA_BOOSTS).map(([name, data]) => (
                  <SelectItem key={name} value={name}>
                    {name} ({data.multiplier}x)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nftBoost">NFT Boost</Label>
            <Select value={nftBoost} onValueChange={(v) => setNftBoost(v as any)}>
              <SelectTrigger id="nftBoost">
                <SelectValue placeholder="Select NFT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (1x)</SelectItem>
                {Object.entries(NFT_BOOSTS).map(([name, data]) => (
                  <SelectItem key={name} value={name}>
                    {name} ({data.multiplier}x)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Results */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Boosted Credits</p>
              <p className="text-2xl font-bold">{formatNumber(boostedCredits)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Network Share</p>
              <p className="text-2xl font-bold">{rewards.networkShare.toFixed(4)}%</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Per Epoch</span>
              <span className="font-medium">{formatCurrency(rewards.perEpoch)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Per Month</span>
              <span className="font-medium">{formatCurrency(rewards.perMonth)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Per Year</span>
              <span className="text-lg font-bold">{formatCurrency(rewards.perYear)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}