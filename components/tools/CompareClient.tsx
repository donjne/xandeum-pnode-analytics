'use client';

import * as React from 'react';
import { GitCompare, X } from 'lucide-react';

import { useNetworkReady } from '@/hooks/use-network-ready';
import { PNode } from '@/lib/types/pnode';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { EmptyState } from '@/components/shared/EmptyState';
import { ComparisonTable } from '@/components/tools/ComparisonTable';

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
function truncatePubkey(pubkey?: string | null) {
  if (!pubkey) return '—';
  return `${pubkey.slice(0, 8)}...${pubkey.slice(-4)}`;
}

export default function CompareClient() {
  /**
   * IMPORTANT:
   * This hook guarantees nodes are fetched
   * even if user lands directly on /compare
   */
  const { nodes, isLoading } = useNetworkReady();

  const [selectedNodes, setSelectedNodes] = React.useState<PNode[]>([]);

  const availableNodes = React.useMemo(() => {
    if (!Array.isArray(nodes)) return [];
    return nodes.filter(
      (node) =>
        node?.pubkey &&
        !selectedNodes.some((n) => n.pubkey === node.pubkey)
    );
  }, [nodes, selectedNodes]);

  const handleAddNode = (pubkey: string) => {
    const node = availableNodes.find((n) => n.pubkey === pubkey);
    if (!node) return;

    if (selectedNodes.length < 5) {
      setSelectedNodes((prev) => [...prev, node]);
    }
  };

  const handleRemoveNode = (pubkey: string) => {
    setSelectedNodes((prev) =>
      prev.filter((n) => n.pubkey !== pubkey)
    );
  };

  const handleClearAll = () => setSelectedNodes([]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
          <GitCompare className="h-8 w-8" />
          Node Comparison
        </h1>
        <p className="text-muted-foreground">
          Compare up to 5 pNodes side by side
        </p>
      </div>

      {/* Node Selector */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>
            Select up to 5 nodes ({selectedNodes.length}/5)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Selected Nodes */}
          {selectedNodes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Selected nodes</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                >
                  Clear all
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedNodes.map((node) => (
                  <div
                    key={node.pubkey}
                    className="flex items-center gap-2 rounded-md border bg-muted px-3 py-1.5 text-sm"
                  >
                    <span className="font-mono">
                      {truncatePubkey(node.pubkey)}
                    </span>
                    <button
                      onClick={() => handleRemoveNode(node.pubkey)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Node Select */}
          {selectedNodes.length < 5 && (
            <Select onValueChange={handleAddNode}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a node to add…" />
              </SelectTrigger>

              <SelectContent
                className="
                  bg-white text-slate-900
                  dark:bg-[#0F1535] dark:text-slate-100
                "
              >
                {availableNodes.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {isLoading ? 'Loading nodes…' : 'No nodes available'}
                  </div>
                ) : (
                  availableNodes.map((node) => (
                    <SelectItem key={node.pubkey} value={node.pubkey}>
                      <span className="font-mono text-sm">
                        {node.pubkey.slice(0, 12)}...
                        {node.pubkey.slice(-8)}
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedNodes.length === 0 ? (
        <EmptyState
          icon={GitCompare}
          title="Select nodes to compare"
          description="Choose up to 5 pNodes to view metrics side by side"
        />
      ) : (
        <ComparisonTable nodes={selectedNodes} />
      )}
    </div>
  );
}
