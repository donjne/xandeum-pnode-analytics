'use client';

import * as React from 'react';
import { useNetworkStore } from '@/stores/networkStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, GitCompare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { ComparisonTable } from '@/components/tools/ComparisonTable';
import { PNode } from '@/lib/types/pnode';

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
function safePubkey(pubkey?: string | null) {
  return typeof pubkey === 'string' ? pubkey : '';
}

export default function CompareClient() {
  const { nodes } = useNetworkStore();

  const [selectedNodes, setSelectedNodes] = React.useState<PNode[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleAddNode = (node: PNode) => {
    if (
      selectedNodes.length < 5 &&
      !selectedNodes.some((n) => n.pubkey === node.pubkey)
    ) {
      setSelectedNodes((prev) => [...prev, node]);
    }
    setOpen(false);
  };

  const handleRemoveNode = (pubkey?: string | null) => {
    if (!pubkey) return;
    setSelectedNodes((prev) =>
      prev.filter((n) => n.pubkey !== pubkey)
    );
  };

  const handleClearAll = () => setSelectedNodes([]);

  const availableNodes = React.useMemo(
    () =>
      Array.isArray(nodes)
        ? nodes.filter(
            (node) =>
              node?.pubkey &&
              !selectedNodes.some((n) => n.pubkey === node.pubkey)
          )
        : [],
    [nodes, selectedNodes]
  );

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
                {selectedNodes.map((node) => {
                  const key = safePubkey(node.pubkey);
                  return (
                    <div
                      key={key || `${node.address}-${node.rpc_port}`}
                      className="flex items-center gap-2 rounded-md border bg-muted px-3 py-1.5 text-sm"
                    >
                      <span className="font-mono">
                        {key
                          ? `${key.slice(0, 8)}...${key.slice(-4)}`
                          : '—'}
                      </span>
                      <button
                        onClick={() => handleRemoveNode(node.pubkey)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Node */}
          {selectedNodes.length < 5 && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  Select a node to add…
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="
                  w-full p-0
                  bg-white text-slate-900
                  border border-slate-200 shadow-xl
                  dark:bg-[#0F1535] dark:text-slate-100 dark:border-white/10
                "
              >
                <Command className="bg-transparent">
                  <CommandInput placeholder="Search nodes…" />
                  <CommandEmpty>No nodes found.</CommandEmpty>

                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {availableNodes.map((node) => {
                      const key = safePubkey(node.pubkey);
                      return (
                          <CommandItem
                            key={key || `${node.address}-${node.rpc_port}`}
                            value={key}
                            onSelect={(value) => {
                              const selected = availableNodes.find(
                                (n) => n.pubkey === value
                              );
                              if (selected) {
                                handleAddNode(selected);
                              }
                            }}
                            className="
                              cursor-pointer
                              aria-selected:bg-blue-500/10
                              dark:aria-selected:bg-blue-500/20
                            "
                          >
                          <Check className="mr-2 h-4 w-4 opacity-0" />
                          <span className="font-mono text-sm">
                            {key
                              ? `${key.slice(0, 12)}...${key.slice(-8)}`
                              : '—'}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </CardContent>
      </Card>

      {/* Comparison */}
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
