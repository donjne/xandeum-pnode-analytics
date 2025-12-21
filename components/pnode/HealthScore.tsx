'use client';

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import { PNode } from '@/lib/types/pnode';
import {
  calculateHealthScore,
  getHealthCategory,
  cn,
} from '@/lib/utils';

/* ---------------------------------------------
   Types
--------------------------------------------- */
interface HealthScoreProps {
  node: PNode;
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function HealthScore({ node }: HealthScoreProps) {
  const score = calculateHealthScore(node);
  const category = getHealthCategory(score);

  const now = Math.floor(Date.now() / 1000);
  const isOnline =
    typeof node.last_seen_timestamp === 'number' &&
    now - node.last_seen_timestamp < 120;

  /* -------------------------------------------
     Category config
  ------------------------------------------- */
  const meta = getHealthMeta(category);

  /* -------------------------------------------
     Component breakdown (REAL DATA)
  ------------------------------------------- */
  const uptimeScore = Math.min(
    100,
    (node.uptime / (24 * 60 * 60)) * 100
  );

  const storageScore =
    100 - Math.abs(node.storage_usage_percent - 50);

  const components = [
    {
      label: 'Availability',
      value: isOnline ? 100 : 0,
    },
    {
      label: 'Uptime',
      value: uptimeScore,
    },
    {
      label: 'Storage Balance',
      value: storageScore,
    },
  ];

  return (
    <Card
      className={cn(
        'relative rounded-2xl border border-transparent',
        // light
        'bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]',
        // dark
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Health Score
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Main score */}
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-4xl font-bold tracking-tight">
              {score}
            </div>
            <div className="text-sm text-muted-foreground">
              out of 100
            </div>
          </div>

          <div className="flex items-center gap-2">
            <meta.icon className={cn('h-5 w-5', meta.color)} />
            <span className="text-sm font-medium">
              {meta.label}
            </span>
          </div>
        </div>

        {/* Progress */}
        <Progress value={score} className="h-2" />

        {/* Breakdown */}
        <div className="space-y-4">
          {components.map((c) => (
            <div key={c.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {c.label}
                </span>
                <span className="font-medium">
                  {Math.round(c.value)}
                </span>
              </div>
              <Progress value={c.value} className="h-1" />
            </div>
          ))}
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between border-t pt-5">
          <span className="text-sm text-muted-foreground">
            Current status
          </span>
          <Badge variant={isOnline ? 'success' : 'destructive'}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

function getHealthMeta(
  category: 'excellent' | 'good' | 'fair' | 'poor'
) {
  switch (category) {
    case 'excellent':
      return {
        label: 'Excellent',
        icon: CheckCircle2,
        color: 'text-green-500',
      };
    case 'good':
      return {
        label: 'Good',
        icon: Activity,
        color: 'text-blue-500',
      };
    case 'fair':
      return {
        label: 'Fair',
        icon: AlertTriangle,
        color: 'text-yellow-500',
      };
    case 'poor':
    default:
      return {
        label: 'Poor',
        icon: XCircle,
        color: 'text-red-500',
      };
  }
}
