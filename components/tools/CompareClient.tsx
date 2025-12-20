'use client';

import * as React from 'react';
import { GitCompare, X, Search } from 'lucide-react';

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
import { cn } from '@/lib/utils';

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
function truncatePubkey(pubkey?: string | null) {
  if (!pubkey) return '—';
  return `${pubkey.slice(0, 8)}…${pubkey.slice(-4)}`;
}

function isValidPubkey(input: string) {
  // simple sanity check (Solana pubkeys are base58 ~44 chars)
  return input.length >= 32 && input.length <= 48;
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export default function CompareClient() {
  /**
   * Guarantees nodes are fetched even
   * if user lands directly on /compare
   */
  const { nodes, isLoading } = useNetworkReady();

  const [selectedNodes, setSelectedNodes] = React.useState<PNode[]>([]);
  const [searchKey, setSearchKey] = React.useState('');
  const [searchTouched, setSearchTouched] = React.useState(false);

  /* ---------------------------------------------
     Derived data
  --------------------------------------------- */

  const selectedPubkeys = React.useMemo(
    () => new Set(selectedNodes.map((n) => n.pubkey)),
    [selectedNodes]
  );

  const availableNodes = React.useMemo(() => {
    if (!Array.isArray(nodes)) return [];
    return nodes.filter(
      (node) => node.pubkey && !selectedPubkeys.has(node.pubkey)
    );
  }, [nodes, selectedPubkeys]);

  const searchedNode = React.useMemo(() => {
    if (!searchKey || !isValidPubkey(searchKey)) return null;
    return nodes.find((n) => n.pubkey === searchKey.trim()) ?? null;
  }, [nodes, searchKey]);

  const canAddMore = selectedNodes.length < 5;

  /* ---------------------------------------------
     Actions
  --------------------------------------------- */

  function addNode(node: PNode) {
    if (!canAddMore) return;
    if (selectedPubkeys.has(node.pubkey)) return;

    setSelectedNodes((prev) => [...prev, node]);
  }

  function handleAddBySelect(pubkey: string) {
    const node = availableNodes.find((n) => n.pubkey === pubkey);
    if (!node) return;
    addNode(node);
  }

  function handleAddBySearch() {
    if (!searchedNode) return;
    addNode(searchedNode);
    setSearchKey('');
    setSearchTouched(false);
  }

  function handleRemoveNode(pubkey: string) {
    setSelectedNodes((prev) => prev.filter((n) => n.pubkey !== pubkey));
  }

  function handleClearAll() {
    setSelectedNodes([]);
    setSearchKey('');
    setSearchTouched(false);
  }

  /* ---------------------------------------------
     Render
  --------------------------------------------- */
  return (
    <div className="space-y-8 animate-fade-in">
      {/* ---------------------------------------------
          Page Header
      --------------------------------------------- */}
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
          <GitCompare className="h-8 w-8" />
          Node Comparison
        </h1>
        <p className="text-muted-foreground">
          Compare up to 5 pNodes side by side across health, storage, uptime and performance.
        </p>
      </div>

      {/* ---------------------------------------------
          Node Selection
      --------------------------------------------- */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>
            Select up to 5 nodes ({selectedNodes.length}/5)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ---------------------------------------------
              Selected Nodes
          --------------------------------------------- */}
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
                    className="
                      flex items-center gap-2
                      rounded-xl border
                      bg-muted/60
                      px-3 py-1.5
                      text-sm
                    "
                  >
                    <span className="font-mono">
                      {truncatePubkey(node.pubkey)}
                    </span>

                    <button
                      onClick={() => handleRemoveNode(node.pubkey)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Remove node"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------
              Search by Public Key
          --------------------------------------------- */}
          {canAddMore && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Add by public key
              </p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={searchKey}
                    onChange={(e) => {
                      setSearchKey(e.target.value);
                      setSearchTouched(true);
                    }}
                    placeholder="Paste full public key…"
                    className={cn(
                      'h-11 w-full rounded-xl border px-10 text-sm font-mono',
                      'bg-background focus:outline-none focus:ring-2 focus:ring-primary/30'
                    )}
                  />
                </div>

                <Button
                  onClick={handleAddBySearch}
                  disabled={!searchedNode || !canAddMore}
                  className="h-11 px-5 rounded-xl"
                >
                  Add
                </Button>
              </div>

              {searchTouched && searchKey && !searchedNode && (
                <p className="text-xs text-muted-foreground">
                  No node found with this public key
                </p>
              )}
            </div>
          )}

          {/* ---------------------------------------------
              Add via Dropdown
          --------------------------------------------- */}
          {canAddMore && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Or select from available nodes
              </p>

              <Select onValueChange={handleAddBySelect}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select a node to add…" />
                </SelectTrigger>

                <SelectContent
                  className="
                    bg-background
                    dark:bg-[#0F1535]
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
                          {node.pubkey.slice(0, 12)}…{node.pubkey.slice(-8)}
                        </span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---------------------------------------------
          Comparison Table
      --------------------------------------------- */}
      {selectedNodes.length === 0 ? (
        <EmptyState
          icon={GitCompare}
          title="Select nodes to compare"
          description="Add up to five pNodes to view their metrics side by side."
        />
      ) : (
        <ComparisonTable nodes={selectedNodes} />
      )}
    </div>
  );
}
