'use client';

import { Activity, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { calculateHealthScore, getHealthCategory } from '@/lib/utils';
import { PNode } from '@/lib/types';

interface HealthScoreProps {
  node: PNode;
}

export function HealthScore({ node }: HealthScoreProps) {
  const score = calculateHealthScore(node);
  const category = getHealthCategory(score);

  const getStatusConfig = () => {
    switch (category) {
      case 'excellent':
        return {
          icon: CheckCircle2,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          label: 'Excellent',
        };
      case 'good':
        return {
          icon: Activity,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          label: 'Good',
        };
      case 'fair':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          label: 'Fair',
        };
      case 'poor':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          label: 'Poor',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  // Calculate component scores
  const now = Math.floor(Date.now() / 1000);
  const isOnline = now - node.last_seen_timestamp < 120;
  const uptimeScore = Math.min(100, (node.uptime / (24 * 60 * 60)) * 100); // Max 1 day uptime = 100
  const storageScore = 100 - Math.abs(node.storage_usage_percent - 50); // Optimal at 50%
  const availabilityScore = isOnline ? 100 : 0;

  const components = [
    { label: 'Availability', score: availabilityScore, weight: 40 },
    { label: 'Uptime', score: uptimeScore, weight: 30 },
    { label: 'Storage Health', score: storageScore, weight: 30 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Score</CardTitle>
        <CardDescription>Overall node performance and reliability</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center gap-6">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${config.borderColor} ${config.bgColor}`}
          >
            <div className="text-center">
              <div className={`text-3xl font-bold ${config.color}`}>{score}</div>
              <div className="text-xs text-muted-foreground">/ 100</div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-5 w-5 ${config.color}`} />
              <span className="text-lg font-semibold">{config.label}</span>
            </div>
            <Progress value={score} className="h-2" />
            <p className="text-sm text-muted-foreground">
              This pNode is performing {config.label.toLowerCase()} across all metrics
            </p>
          </div>
        </div>

        {/* Component Breakdown */}
        <div className="space-y-3 border-t pt-4">
          <h4 className="text-sm font-medium">Score Breakdown</h4>
          {components.map((component) => (
            <div key={component.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {component.label} ({component.weight}%)
                </span>
                <span className="font-medium">{component.score.toFixed(0)}</span>
              </div>
              <Progress value={component.score} className="h-1" />
            </div>
          ))}
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span className="text-sm text-muted-foreground">Current Status</span>
          <Badge variant={isOnline ? 'success' : 'destructive'}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}