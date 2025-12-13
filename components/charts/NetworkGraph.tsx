'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network } from 'lucide-react';

export interface NetworkNode {
  id: string;
  label: string;
  group?: string;
  size?: number;
  color?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  strength?: number;
}

interface NetworkGraphProps {
  title?: string;
  description?: string;
  nodes: NetworkNode[];
  links: NetworkLink[];
  height?: number;
  className?: string;
}

export function NetworkGraph({
  title,
  description,
  nodes,
  links,
  height = 400,
  className,
}: NetworkGraphProps) {
  // Simple visualization - in production, use D3.js or react-force-graph
  const groups = React.useMemo(() => {
    const groupMap = new Map<string, number>();
    nodes.forEach((node) => {
      const group = node.group || 'default';
      groupMap.set(group, (groupMap.get(group) || 0) + 1);
    });
    return Array.from(groupMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [nodes]);

  const content = (
    <div className="space-y-4">
      {/* Placeholder visualization */}
      <div
        className="relative flex items-center justify-center rounded-lg border bg-muted/10"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <Network className="mx-auto h-16 w-16 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium">Network Graph Visualization</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {nodes.length} nodes • {links.length} connections
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Interactive force-directed graph coming soon
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Total Nodes</p>
          <p className="text-2xl font-bold">{nodes.length}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Connections</p>
          <p className="text-2xl font-bold">{links.length}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Avg Connections</p>
          <p className="text-2xl font-bold">
            {nodes.length > 0 ? (links.length / nodes.length).toFixed(1) : 0}
          </p>
        </div>
      </div>

      {/* Groups */}
      {groups.length > 1 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Node Groups</p>
          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <Badge key={group.name} variant="secondary">
                {group.name}: {group.count}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (!title) {
    return content;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}