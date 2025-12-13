import { PNode } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatBytes, formatDuration, formatPubkey, formatPercentage } from '@/lib/utils';
import { calculateHealthScore, getHealthCategory } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { GitCompare } from 'lucide-react';

interface ComparisonTableProps {
  nodes: PNode[];
}

export function ComparisonTable({ nodes }: ComparisonTableProps) {
  if (nodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            <CardTitle>Node Comparison</CardTitle>
          </div>
          <CardDescription>Select up to 5 pNodes to compare side-by-side</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">No nodes selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          <CardTitle>Node Comparison</CardTitle>
        </div>
        <CardDescription>Comparing {nodes.length} pNode(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Metric</TableHead>
                {nodes.map((node) => (
                  <TableHead key={node.pubkey} className="min-w-[150px]">
                    <div className="space-y-1">
                      <p className="font-mono text-xs">{formatPubkey(node.pubkey, 6)}</p>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Status */}
              <TableRow>
                <TableCell className="font-medium">Status</TableCell>
                {nodes.map((node) => {
                  const now = Math.floor(Date.now() / 1000);
                  const isOnline = now - node.last_seen_timestamp < 120;
                  return (
                    <TableCell key={node.pubkey}>
                      <StatusBadge status={isOnline ? 'online' : 'offline'} />
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Health Score */}
              <TableRow>
                <TableCell className="font-medium">Health Score</TableCell>
                {nodes.map((node) => {
                  const score = calculateHealthScore(node);
                  const category = getHealthCategory(score);
                  return (
                    <TableCell key={node.pubkey}>
                      <Badge
                        variant={
                          category === 'excellent'
                            ? 'success'
                            : category === 'good'
                              ? 'default'
                              : category === 'fair'
                                ? 'warning'
                                : 'destructive'
                        }
                      >
                        {score}
                      </Badge>
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Version */}
              <TableRow>
                <TableCell className="font-medium">Version</TableCell>
                {nodes.map((node) => (
                  <TableCell key={node.pubkey} className="font-mono text-sm">
                    {node.version}
                  </TableCell>
                ))}
              </TableRow>

              {/* Uptime */}
              <TableRow>
                <TableCell className="font-medium">Uptime</TableCell>
                {nodes.map((node) => (
                  <TableCell key={node.pubkey}>{formatDuration(node.uptime)}</TableCell>
                ))}
              </TableRow>

              {/* Storage Committed */}
              <TableRow>
                <TableCell className="font-medium">Storage Committed</TableCell>
                {nodes.map((node) => (
                  <TableCell key={node.pubkey}>{formatBytes(node.storage_committed)}</TableCell>
                ))}
              </TableRow>

              {/* Storage Used */}
              <TableRow>
                <TableCell className="font-medium">Storage Used</TableCell>
                {nodes.map((node) => (
                  <TableCell key={node.pubkey}>{formatBytes(node.storage_used)}</TableCell>
                ))}
              </TableRow>

              {/* Storage Utilization */}
              <TableRow>
                <TableCell className="font-medium">Utilization</TableCell>
                {nodes.map((node) => (
                  <TableCell key={node.pubkey}>
                    {formatPercentage(node.storage_usage_percent, 1)}
                  </TableCell>
                ))}
              </TableRow>

              {/* Address */}
              <TableRow>
                <TableCell className="font-medium">Address</TableCell>
                {nodes.map((node) => (
                  <TableCell key={node.pubkey} className="font-mono text-xs">
                    {node.address}
                  </TableCell>
                ))}
              </TableRow>

              {/* RPC Port */}
              <TableRow>
                <TableCell className="font-medium">RPC Port</TableCell>
                {nodes.map((node) => (
                  <TableCell key={node.pubkey}>{node.rpc_port}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}