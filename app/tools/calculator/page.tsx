import { Metadata } from 'next';
import { RewardCalculator } from '@/components/tools/RewardCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reward Calculator | Xandeum pNode Analytics',
  description: 'Calculate potential XAND rewards for pNode operators',
};

export default function CalculatorPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
          <Calculator className="h-8 w-8" />
          Reward Calculator
        </h1>
        <p className="text-muted-foreground">
          Estimate your potential XAND rewards based on era and NFT multipliers
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/50 bg-blue-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-500">
            <Info className="h-5 w-5" />
            How Rewards Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Base Credits:</strong> Earned through heartbeat responses (+1 per success, -100 per failure)
          </p>
          <p>
            <strong>Era Multipliers:</strong> Deep South (16x), South (10x), Mine (7x), Coal (3.5x), Central (2x), North (1.25x)
          </p>
          <p>
            <strong>NFT Multipliers:</strong> Titan (11x), Dragon (4x), Coyote (2.5x), Rabbit (1.5x), Cricket (1.1x)
          </p>
          <p>
            <strong>Combined:</strong> Total boost = Era × NFT (e.g., Deep South + Titan = 16 × 11 = 176x)
          </p>
        </CardContent>
      </Card>

      {/* Calculator Component */}
      <RewardCalculator />

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding STOINC</CardTitle>
          <CardDescription>Storage Income explained</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold">Short-Term (DevNet)</h3>
              <p className="text-sm text-muted-foreground">
                Foundation-funded incentives: ~10,000 XAND/month per pNode. 
                Paid quarterly. Rewards participation in testing and development.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Long-Term (MainNet)</h3>
              <p className="text-sm text-muted-foreground">
                94% of app fees distributed to pNodes based on boosted credits. 
                Early operators benefit from era/NFT multipliers up to 176x.
              </p>
            </div>
          </div>
          
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Maximizing Rewards</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Maintain 100% uptime for maximum daily credits (~2,880)</li>
              <li>Early adoption provides the highest era multipliers</li>
              <li>NFT boosts are permanent and stackable with era boosts</li>
              <li>Credits roll over monthly for fair seasonal distribution</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}