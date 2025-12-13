'use client';

import * as React from 'react';
import { ComparisonTable } from '@/components/tools/ComparisonTable';
import { useNetworkStore } from '@/stores/networkStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, GitCompare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { PNode } from '@/lib/types/pnode';

export default function ComparePage() {
  const { nodes } = useNetworkStore();
  const [selectedNodes, setSelectedNodes] = React.useState<PNode[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleAddNode = (node: PNode) => {
    if (selectedNodes.length < 5 && !selectedNodes.find((n) => n.pubkey === node.pubkey)) {
      setSelectedNodes([...selectedNodes, node]);
    }
    setOpen(false);
  };

  const handleRemoveNode = (pubkey: string) => {
    setSelectedNodes(selectedNodes.filter((n) => n.pubkey !== pubkey));
  };

  const handleClearAll = () => {
    setSelectedNodes([]);
  };

  const availableNodes = nodes.filter(
    (node) => !selectedNodes.find((n) => n.pubkey === node.pubkey)
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

      {/* Node Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Nodes to Compare</CardTitle>
          <CardDescription>
            Choose up to 5 pNodes ({selectedNodes.length}/5 selected)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Nodes */}
          {selectedNodes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Selected Nodes:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedNodes.map((node) => (
                  <div
                    key={node.pubkey}
                    className="flex items-center gap-2 rounded-md border bg-muted px-3 py-1.5 text-sm"
                  >
                    <span className="font-mono">
                      {node.pubkey.slice(0, 8)}...{node.pubkey.slice(-4)}
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

          {/* Add Node Dropdown */}
          {selectedNodes.length < 5 && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={selectedNodes.length >= 5}
                >
                  {selectedNodes.length >= 5
                    ? 'Maximum nodes selected'
                    : 'Select a node to add...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search nodes..." />
                  <CommandEmpty>No nodes found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {availableNodes.map((node) => (
                      <CommandItem
                        key={node.pubkey}
                        onSelect={() => handleAddNode(node)}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedNodes.find((n) => n.pubkey === node.pubkey)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        <span className="font-mono text-sm">
                          {node.pubkey.slice(0, 12)}...{node.pubkey.slice(-8)}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedNodes.length === 0 ? (
        <EmptyState
          icon={GitCompare}
          title="No Nodes Selected"
          description="Select at least one node to start comparing"
        />
      ) : (
        <ComparisonTable nodes={selectedNodes} />
      )}
    </div>
  );
}