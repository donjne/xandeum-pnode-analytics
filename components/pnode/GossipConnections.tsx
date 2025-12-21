'use client';

import { Network } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TruncatedText } from '@/components/shared/TruncatedText';
import { cn } from '@/lib/utils';

/* ---------------------------------------------
   Types
--------------------------------------------- */
export interface GossipPeer {
  pubkey: string;
  address?: string;
  version?: string;
  isOnline: boolean;
}

/* ---------------------------------------------
   Props
--------------------------------------------- */
interface GossipConnectionsProps {
  peers?: GossipPeer[];
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function GossipConnections({ peers }: GossipConnectionsProps) {
  /* -------------------------------------------
     No real data yet
  ------------------------------------------- */
  if (!peers || peers.length === 0) {
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
            <Network className="h-5 w-5" />
            Gossip Connections
          </CardTitle>
        </CardHeader>

        <CardContent className="flex h-[260px] items-center justify-center">
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Gossip peer information will appear once real-time peer discovery
            data is available from the network.
          </p>
        </CardContent>
      </Card>
    );
  }

  /* -------------------------------------------
     Derived stats
  ------------------------------------------- */
  const onlineCount = peers.filter((p) => p.isOnline).length;

  /* -------------------------------------------
     Render
  ------------------------------------------- */
  return (
    <Card
      className={cn(
        'rounded-2xl border border-transparent',
        'bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]',
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Network className="h-5 w-5" />
            Gossip Connections
          </CardTitle>

          <Badge variant="outline">
            {onlineCount}/{peers.length} online
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Peer list */}
        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-2">
            {peers.map((peer) => (
              <div
                key={peer.pubkey}
                className="flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={peer.isOnline ? 'online' : 'offline'}
                      showIcon={false}
                    />
                    <TruncatedText
                      text={peer.pubkey}
                      maxLength={8}
                      showCopy
                    />
                  </div>

                  {(peer.address || peer.version) && (
                    <div className="text-xs text-muted-foreground">
                      {peer.address && (
                        <span className="font-mono">{peer.address}</span>
                      )}
                      {peer.address && peer.version && <span> · </span>}
                      {peer.version && <span>v{peer.version}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Context */}
        <div className="rounded-xl bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          Gossip connections represent peer discovery relationships and do not
          imply direct storage or reward relationships.
        </div>
      </CardContent>
    </Card>
  );
}
