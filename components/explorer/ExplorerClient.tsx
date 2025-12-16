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

export default function ExplorerClient() {
  const { nodes, isLoading } = useNetwork();

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

  const filteredNodes = React.useMemo(() => {
    let result = [...nodes];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (node) =>
          node.pubkey.toLowerCase().includes(s) ||
          node.address.toLowerCase().includes(s)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter((node) => node.status === filters.status);
    }

    if (filters.version) {
      result = result.filter((node) => node.version === filters.version);
    }

    if (filters.minStorage > 0) {
      const min = filters.minStorage * 1073741824;
      result = result.filter((n) => n.storage_committed >= min);
    }

    if (filters.maxStorage > 0) {
      const max = filters.maxStorage * 1073741824;
      result = result.filter((n) => n.storage_committed <= max);
    }

    result.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (filters.sortBy) {
        case 'health':
          aVal = a.health_score || 0;
          bVal = b.health_score || 0;
          break;
        case 'uptime':
          aVal = a.uptime || 0;
          bVal = b.uptime || 0;
          break;
        case 'storage':
          aVal = a.storage_committed || 0;
          bVal = b.storage_committed || 0;
          break;
        case 'utilization':
          aVal = a.storage_used / (a.storage_committed || 1);
          bVal = b.storage_used / (b.storage_committed || 1);
          break;
        case 'lastSeen':
          aVal = a.last_seen_timestamp || 0;
          bVal = b.last_seen_timestamp || 0;
          break;
        case 'version':
          aVal = a.version;
          bVal = b.version;
          break;
        default:
          return 0;
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading pNodes...</p>
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">pNode Explorer</h1>
          <p className="text-muted-foreground">
            Browse and search all {nodes.length} provider nodes
          </p>
        </div>

        <div className="flex gap-2">
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
                <DialogTitle>Data Source Settings</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Data fetched via xandeum-prpc SDK
              </p>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          className="flex-1"
          placeholder="Search by pubkey or address..."
        />
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {paginatedNodes.length} of {filteredNodes.length}
      </div>

      {viewMode === 'grid' ? (
        <PNodeGrid nodes={paginatedNodes} />
      ) : (
        <PNodeTable nodes={paginatedNodes} />
      )}

      {totalPages > 1 && (
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
      )}
    </div>
  );
}
