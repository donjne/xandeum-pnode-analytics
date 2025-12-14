'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PNode } from '@/lib/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TimeAgo } from '@/components/shared/TimeAgo';
import { calculateHealthScore, getHealthCategory } from '@/lib/utils';

interface PNodeHeaderProps {
  node: PNode;
}

export function PNodeHeader({ node }: PNodeHeaderProps) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  const now = Math.floor(Date.now() / 1000);
  const isOnline = now - node.last_seen_timestamp < 120;
  const healthScore = calculateHealthScore(node);
  const healthCategory = getHealthCategory(healthScore);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(node.pubkey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Nodes
      </Button>

      {/* Header content */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          {/* Pubkey and copy */}
          <div className="flex items-center gap-2">
            <h1 className="break-all font-mono text-2xl font-bold tracking-tight">
              {node.pubkey}
            </h1>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy pubkey</span>
            </Button>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={isOnline ? 'online' : 'offline'} />
            <Badge
              variant={
                healthCategory === 'excellent'
                  ? 'success'
                  : healthCategory === 'good'
                    ? 'default'
                    : healthCategory === 'fair'
                      ? 'warning'
                      : 'destructive'
              }
            >
              Health: {healthScore}
            </Badge>
            <Badge variant="outline">v{node.version}</Badge>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Address:</span>
              <span className="font-mono">{node.address}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <span>RPC Port:</span>
              <span className="font-mono">{node.rpc_port}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <span>Last seen:</span>
              <TimeAgo timestamp={node.last_seen_timestamp} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a
              href={`http://${node.address.split(':')[0]}:${node.rpc_port}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open RPC
            </a>
          </Button>
        </div>
      </div>

      <Separator />
    </div>
  );
}