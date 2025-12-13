'use client';

import { Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PNode } from '@/lib/types';
import { PNodeCard } from './PNodeCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Server } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PNodeGridProps {
  nodes: PNode[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export function PNodeGrid({
  nodes,
  loading = false,
  viewMode = 'grid',
  onViewModeChange,
}: PNodeGridProps) {
  if (loading) {
    return <LoadingSpinner text="Loading pNodes..." />;
  }

  if (nodes.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="No pNodes found"
        description="Try adjusting your search or filters"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* View mode toggle */}
      {onViewModeChange && (
        <div className="flex justify-end">
          <div className="inline-flex rounded-lg border p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-8 gap-2"
            >
              <Grid3x3 className="h-4 w-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-8 gap-2"
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </div>
        </div>
      )}

      {/* Grid/List view */}
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
            : 'space-y-4'
        )}
      >
        {nodes.map((node) => (
          <PNodeCard key={node.pubkey} node={node} />
        ))}
      </div>
    </div>
  );
}
