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

  if (!nodes || nodes.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="No pNodes found"
        description="Try adjusting your search or filters"
      />
    );
  }

  return (
    <section className="space-y-6">
      {/* View Mode Toggle (only when controlled) */}
      {onViewModeChange && (
        <div className="flex justify-end">
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-xl p-1',
              // light mode
              'bg-muted/60',
              // dark mode
              'dark:bg-white/5'
            )}
          >
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-8 gap-2 rounded-lg"
            >
              <Grid3x3 className="h-4 w-4" />
              Grid
            </Button>

            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-8 gap-2 rounded-lg"
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </div>
        </div>
      )}

      {/* Grid / List */}
      <div
        className={cn(
          viewMode === 'grid'
            ? [
                // mobile
                'grid gap-4',
                // tablet
                'sm:grid-cols-2',
                // desktop
                'lg:grid-cols-3',
                'xl:grid-cols-3',
              ].join(' ')
            : 'space-y-4'
        )}
      >
        {nodes.map((node) => (
          <PNodeCard key={node.pubkey} node={node} />
        ))}
      </div>
    </section>
  );
}
