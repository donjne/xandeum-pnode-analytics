'use client';

import {
  Coins,
  Zap,
  Award,
  AlertCircle,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn, formatNumber } from '@/lib/utils';

/* ---------------------------------------------
   Types
--------------------------------------------- */
interface RewardBoost {
  name: string;
  multiplier: number;
}

interface RewardsPanelProps {
  credits?: number;
  boostedCredits?: number;
  boosts?: RewardBoost[];
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function RewardsPanel({
  credits,
  boostedCredits,
  boosts,
}: RewardsPanelProps) {
  const hasData =
    typeof credits === 'number' ||
    typeof boostedCredits === 'number' ||
    (boosts && boosts.length > 0);

  const totalMultiplier =
    boosts && boosts.length > 0
      ? boosts.reduce((acc, b) => acc * b.multiplier, 1)
      : null;

  return (
    <Card
      className={cn(
        'rounded-2xl border border-transparent',
        'bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]',
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Coins className="h-5 w-5" />
          Credits & Boosts
        </CardTitle>
        <CardDescription>
          Node credit accumulation and active multipliers
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ------------------------------
            No Data State
        ------------------------------- */}
        {!hasData && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Reward and credit data is not yet available for this pNode.
            </p>
          </div>
        )}

        {/* ------------------------------
            Credits
        ------------------------------- */}
        {typeof credits === 'number' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Base Credits
              </span>
              <span className="text-2xl font-semibold">
                {formatNumber(credits)}
              </span>
            </div>

            {typeof boostedCredits === 'number' && (
              <div className="flex items-center justify-between rounded-xl bg-primary/10 p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Boosted Credits
                  </span>
                </div>
                <span className="text-xl font-semibold text-primary">
                  {formatNumber(boostedCredits)}
                </span>
              </div>
            )}

            {totalMultiplier && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total Multiplier</span>
                <span className="font-medium">{totalMultiplier}x</span>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------
            Boosts
        ------------------------------- */}
        {boosts && boosts.length > 0 && (
          <>
            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">
                Active Boosts
              </h4>

              <div className="space-y-2">
                {boosts.map((boost) => (
                  <div
                    key={boost.name}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {boost.name}
                      </span>
                    </div>

                    <Badge variant="secondary">
                      {boost.multiplier}x
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ------------------------------
            Disclaimer
        ------------------------------- */}
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <p>
            Credits and boost data reflect protocol-level metrics.
            Reward payouts and conversions will be displayed once
            emission rules are finalized.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
