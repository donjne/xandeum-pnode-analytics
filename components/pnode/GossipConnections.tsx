import * as React from 'react';
import { Network, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TruncatedText } from '@/components/shared/TruncatedText';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

interface GossipPeer {
  pubkey: string;
  address: string;
  version: string;
  isOnline: boolean;
  latency?: number;
}

interface GossipConnectionsProps {
  peers?: GossipPeer[];
}

// Mock data generator
const generateMockPeers = (): GossipPeer[] => {
  const mockPubkeys = [
    '7qbRQPVBfxXjJpEa1rnz8JgmKBaUvCpVZPEqoKNh8uHr',
    '2asTHq4vVGazKrmEa3YTXKuYiNZBdv1cQoLc1Tr2kvaw',
    'HhuygLTeS6grue95pKKzak2UPuQMXepWbvQv2ToQfbZN',
    '6vy4sYV6nTLJQ4tBcXUGgPTuGorVh2FJkm6ToVMFSfr2',
    'CYQCxRcrSNg2XUiM42tp6bUtbWzZEdmTNawhBg5hSLoo',
  ];

  return mockPubkeys.map((pubkey, i) => ({
    pubkey,
    address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}:9001`,
    version: '0.7.0',
    isOnline: Math.random() > 0.2,
    latency: Math.floor(Math.random() * 100) + 10,
  }));
};

export function GossipConnections({ peers = generateMockPeers() }: GossipConnectionsProps) {
  const onlinePeers = peers.filter((p) => p.isOnline);
  const avgLatency =
    onlinePeers.reduce((sum, p) => sum + (p.latency || 0), 0) / onlinePeers.length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Gossip Connections
            </CardTitle>
            <CardDescription>Connected peers in the gossip network</CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {onlinePeers.length}/{peers.length} Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Peers</p>
            <p className="text-2xl font-bold">{peers.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-500">{onlinePeers.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Avg Latency</p>
            <p className="text-2xl font-bold">{avgLatency.toFixed(0)}ms</p>
          </div>
        </div>

        {/* Peer list */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {peers.map((peer) => (
              <div
                key={peer.pubkey}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={peer.isOnline ? 'online' : 'offline'} showIcon={false} />
                    <TruncatedText text={peer.pubkey} maxLength={6} showCopy={false} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{peer.address}</span>
                    <span>•</span>
                    <span>v{peer.version}</span>
                    {peer.latency && (
                      <>
                        <span>•</span>
                        <span>{peer.latency}ms</span>
                      </>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View peer</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Info */}
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <p>
            Gossip protocol enables pNodes to discover peers, share status updates, and coordinate
            data distribution across the network.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}