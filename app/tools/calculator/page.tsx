'use client';

import { RewardCalculator } from '@/components/tools/RewardCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Info } from 'lucide-react';

export default function CalculatorPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page intro */}
      <div className="space-y-1">
        <p className="text-muted-foreground max-w-2xl">
          Estimate your potential XAND rewards using era and NFT multipliers.
        </p>
      </div>

      {/* Info card */}
      <Card
        className="
          rounded-2xl border border-transparent
          bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]
          dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl
          dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-blue-500" />
            How Rewards Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Base Credits:</strong> Earned from heartbeat
            responses (+1 success, −100 failure).
          </p>
          <p>
            <strong className="text-foreground">Era Multipliers:</strong> Deep South (16x), South
            (10x), Mine (7x), Coal (3.5x), Central (2x), North (1.25x).
          </p>
          <p>
            <strong className="text-foreground">NFT Multipliers:</strong> Titan (11x), Dragon (4x),
            Coyote (2.5x), Rabbit (1.5x), Cricket (1.1x).
          </p>
          <p>
            <strong className="text-foreground">Final Boost:</strong> Era × NFT (e.g. 16 × 11 =
            176×).
          </p>
        </CardContent>
      </Card>

      {/* Calculator */}
      <RewardCalculator />

      {/* STOINC explanation */}
      <Card
        className="
          rounded-2xl border border-transparent
          bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]
          dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl
          dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      >
        <CardHeader>
          <CardTitle>Understanding STOINC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Short-Term (DevNet)</h3>
              <p className="text-sm text-muted-foreground">
                Foundation-funded incentives (~10,000 XAND/month per pNode),
                distributed quarterly.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Long-Term (MainNet)</h3>
              <p className="text-sm text-muted-foreground">
                94% of app fees distributed to pNodes, weighted by boosted
                credits.
              </p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <h3 className="font-medium">Maximizing Rewards</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Maintain near-perfect uptime</li>
              <li>Earlier eras provide exponential advantage</li>
              <li>NFT boosts are permanent</li>
              <li>Credits roll over monthly</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
