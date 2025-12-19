'use client';

import * as React from 'react';
import {
  SearchBar,
  FilterPanel,
  PNodeGrid,
  PNodeTable,
  Pagination,
  FilterState,
} from '@/components/explorer';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Table as TableIcon, Settings } from 'lucide-react';
import { useNetwork } from '@/hooks/use-network';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ExplorerClient() {
  const { nodes = [], isLoading } = useNetwork(); // ⬅️ defensive default

  const [search, setSearch] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);

  const [filters, setFilters] = React.useState<FilterState>({
    status: 'all',
    sortBy: 'health',
    sortOrder: 'desc',
    minStorage: 0,
    maxStorage: 0,
    version: '',
  });

  /* ---------------------------------------------
     Filter + Sort (SAFE)
  --------------------------------------------- */
  const filteredNodes = React.useMemo(() => {
    if (!Array.isArray(nodes)) return [];

    let result = [...nodes];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (n) =>
          n?.pubkey?.toLowerCase().includes(s) ||
          n?.address?.toLowerCase().includes(s)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter((n) => n.status === filters.status);
    }

    if (filters.version) {
      result = result.filter((n) => n.version === filters.version);
    }

    if (filters.minStorage > 0) {
      const min = filters.minStorage * 1024 ** 3;
      result = result.filter((n) => n.storage_committed >= min);
    }

    if (filters.maxStorage > 0) {
      const max = filters.maxStorage * 1024 ** 3;
      result = result.filter((n) => n.storage_committed <= max);
    }

    result.sort((a, b) => {
      let aVal: any = 0;
      let bVal: any = 0;

      switch (filters.sortBy) {
        case 'health':
          aVal = a.health_score ?? 0;
          bVal = b.health_score ?? 0;
          break;
        case 'uptime':
          aVal = a.uptime ?? 0;
          bVal = b.uptime ?? 0;
          break;
        case 'storage':
          aVal = a.storage_committed ?? 0;
          bVal = b.storage_committed ?? 0;
          break;
        case 'utilization':
          aVal = a.storage_used / (a.storage_committed || 1);
          bVal = b.storage_used / (b.storage_committed || 1);
          break;
        case 'lastSeen':
          aVal = a.last_seen_timestamp ?? 0;
          bVal = b.last_seen_timestamp ?? 0;
          break;
        case 'version':
          aVal = a.version ?? '';
          bVal = b.version ?? '';
          break;
      }

      return filters.sortOrder === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });

    return result;
  }, [nodes, search, filters]);

  React.useEffect(() => {
    setPage(1);
  }, [search, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading pNodes…</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredNodes.length / pageSize);
  const paginatedNodes = filteredNodes.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <section className="space-y-6">
      {/* ---------------------------------------------
          Explorer Controls Surface
      --------------------------------------------- */}
      <Card
        className={cn(
          'rounded-2xl border border-transparent',
          'bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]',
          'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
          'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
        )}
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={setSearch}
            className="flex-1"
            placeholder="Search by pubkey or address…"
          />

          <FilterPanel filters={filters} onChange={setFilters} />

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <TableIcon className="h-4 w-4" />
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Data Source</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Data fetched via xandeum-prpc SDK
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* ---------------------------------------------
          Results
      --------------------------------------------- */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedNodes.length} of {filteredNodes.length}
      </div>

      {viewMode === 'grid' ? (
        <PNodeGrid nodes={paginatedNodes} />
      ) : (
        <PNodeTable nodes={paginatedNodes} />
      )}

      {/* ---------------------------------------------
          Pagination
      --------------------------------------------- */}
      {totalPages > 1 && (
        <Card
          className={cn(
            'rounded-2xl border border-transparent p-4',
            'bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]',
            'dark:bg-[#0A0E27]/70 dark:backdrop-blur-xl',
            'dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)]'
          )}
        >
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredNodes.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </Card>
      )}
    </section>
  );
}
