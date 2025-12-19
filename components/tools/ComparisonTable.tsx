'use client';

import { PNode } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  formatBytes,
  formatDuration,
  formatPercentage,
} from '@/lib/utils';
import { calculateHealthScore, getHealthCategory } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
function safePubkey(pubkey?: string | null) {
  return typeof pubkey === 'string' ? pubkey : '';
}

interface ComparisonTableProps {
  nodes: PNode[];
}

export function ComparisonTable({ nodes }: ComparisonTableProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>
          Comparing {nodes.length} pNode{nodes.length > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 bg-background w-[180px]">
                  Metric
                </TableHead>
                {nodes.map((node) => {
                  const key = safePubkey(node.pubkey);
                  return (
                    <TableHead
                      key={key || `${node.address}-${node.rpc_port}`}
                      className="min-w-[160px]"
                    >
                      <p className="font-mono text-xs">
                        {key
                          ? `${key.slice(0, 6)}...${key.slice(-4)}`
                          : '—'}
                      </p>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Status */}
              <TableRow>
                <TableCell className="sticky left-0 bg-background font-medium">
                  Status
                </TableCell>
                {nodes.map((node) => {
                  const now = Math.floor(Date.now() / 1000);
                  const online =
                    typeof node.last_seen_timestamp === 'number' &&
                    now - node.last_seen_timestamp < 120;

                  return (
                    <TableCell
                      key={safePubkey(node.pubkey) || node.address}
                    >
                      <StatusBadge
                        status={online ? 'online' : 'offline'}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Health */}
              <TableRow>
                <TableCell className="sticky left-0 bg-background font-medium">
                  Health
                </TableCell>
                {nodes.map((node) => {
                  const score = calculateHealthScore(node);
                  const category = getHealthCategory(score);
                  return (
                    <TableCell
                      key={safePubkey(node.pubkey) || node.address}
                    >
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
                <TableCell className="sticky left-0 bg-background font-medium">
                  Version
                </TableCell>
                {nodes.map((node) => (
                  <TableCell
                    key={safePubkey(node.pubkey) || node.address}
                    className="font-mono text-sm"
                  >
                    {node.version ?? '—'}
                  </TableCell>
                ))}
              </TableRow>

              {/* Uptime */}
              <TableRow>
                <TableCell className="sticky left-0 bg-background font-medium">
                  Uptime
                </TableCell>
                {nodes.map((node) => (
                  <TableCell
                    key={safePubkey(node.pubkey) || node.address}
                  >
                    {formatDuration(node.uptime)}
                  </TableCell>
                ))}
              </TableRow>

              {/* Storage */}
              <TableRow>
                <TableCell className="sticky left-0 bg-background font-medium">
                  Storage Used
                </TableCell>
                {nodes.map((node) => (
                  <TableCell
                    key={safePubkey(node.pubkey) || node.address}
                  >
                    {formatBytes(node.storage_used)} /{' '}
                    {formatBytes(node.storage_committed)}
                  </TableCell>
                ))}
              </TableRow>

              {/* Utilization */}
              <TableRow>
                <TableCell className="sticky left-0 bg-background font-medium">
                  Utilization
                </TableCell>
                {nodes.map((node) => (
                  <TableCell
                    key={safePubkey(node.pubkey) || node.address}
                  >
                    {formatPercentage(node.storage_usage_percent, 1)}
                  </TableCell>
                ))}
              </TableRow>

              {/* Address */}
              <TableRow>
                <TableCell className="sticky left-0 bg-background font-medium">
                  Address
                </TableCell>
                {nodes.map((node) => (
                  <TableCell
                    key={safePubkey(node.pubkey) || node.address}
                    className="font-mono text-xs"
                  >
                    {node.address ?? '—'}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
