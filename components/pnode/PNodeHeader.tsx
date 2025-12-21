'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { StatusBadge } from '@/components/shared/StatusBadge';
import { TimeAgo } from '@/components/shared/TimeAgo';

import { PNode } from '@/lib/types/pnode';
import {
  calculateHealthScore,
  getHealthCategory,
  cn,
} from '@/lib/utils';

/* ---------------------------------------------
   Types
--------------------------------------------- */
interface PNodeHeaderProps {
  node: PNode;
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function PNodeHeader({ node }: PNodeHeaderProps) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  const now = Math.floor(Date.now() / 1000);
  const isOnline =
    typeof node.last_seen_timestamp === 'number' &&
    now - node.last_seen_timestamp < 120;

  const healthScore = calculateHealthScore(node);
  const healthCategory = getHealthCategory(healthScore);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(node.pubkey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* silent */
    }
  };

  return (
    <section
      className={cn(
        'relative rounded-2xl',
        'bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]',
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_24px_70px_rgba(0,0,0,0.45)]'
      )}
    >
      <div className="px-6 py-6 sm:px-8">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explorer
        </Button>

        {/* Main header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left */}
          <div className="space-y-4">
            {/* Pubkey */}
            <div className="flex items-start gap-3">
              <h1 className="break-all font-mono text-xl font-semibold tracking-tight sm:text-2xl">
                {node.pubkey}
              </h1>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="mt-0.5 text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy pubkey</span>
              </Button>
            </div>

            {/* Status row */}
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
                Health · {healthScore}
              </Badge>

              <Badge variant="outline" className="font-mono">
                v{node.version}
              </Badge>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>Address</span>
                <span className="font-mono text-foreground">
                  {node.address}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span>RPC</span>
                <span className="font-mono text-foreground">
                  {node.rpc_port}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span>Last seen</span>
                <TimeAgo timestamp={node.last_seen_timestamp} />
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              asChild
              className="gap-2"
            >
              <a
                href={`http://${node.address.split(':')[0]}:${node.rpc_port}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Open RPC
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Separator />
    </section>
  );
}
