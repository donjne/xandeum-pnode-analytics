'use client';

import * as React from 'react';
import { Metadata } from 'next';
import { SearchBar, FilterPanel, PNodeGrid, PNodeTable, Pagination, FilterState } from '@/components/explorer';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Table as TableIcon, Settings } from 'lucide-react';
import { useNetwork } from '@/hooks/use-network';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ExplorerPage() {
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

  // Filter nodes based on search and filters
  const filteredNodes = React.useMemo(() => {
    let result = [...nodes];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (node) =>
          node.pubkey.toLowerCase().includes(searchLower) ||
          node.address.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((node) => node.status === filters.status);
    }

    // Version filter
    if (filters.version) {
      result = result.filter((node) => node.version === filters.version);
    }

    // Storage range filter
    if (filters.minStorage && filters.minStorage > 0) {
      const min = filters.minStorage * 1073741824; // GB to bytes
      result = result.filter((node) => node.storage_committed >= min);
    }
    if (filters.maxStorage && filters.maxStorage > 0) {
      const max = filters.maxStorage * 1073741824; // GB to bytes
      result = result.filter((node) => node.storage_committed <= max);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any, bVal: any;

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

      if (filters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [nodes, search, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredNodes.length / pageSize);
  const paginatedNodes = filteredNodes.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Reset page when filters change
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            pNode Explorer
          </h1>
          <p className="text-muted-foreground">
            Browse and search all {nodes.length} provider nodes
          </p>
        </div>
        
        {/* View Mode Toggle + Settings */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          
          {/* Data Source Settings */}
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
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Data is fetched directly from pNode network using xandeum-prpc SDK.
                </p>
                <p className="text-xs text-muted-foreground">
                  Connected to: {nodes.length > 0 ? nodes[0].address : 'No nodes found'}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by pubkey or address..."
          className="flex-1"
        />
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedNodes.length} of {filteredNodes.length} nodes
        {search || filters.status !== 'all' ? ' (filtered)' : ''}
      </div>

      {/* Node Grid or Table */}
      {viewMode === 'grid' ? (
        <PNodeGrid
          nodes={paginatedNodes}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      ) : (
        <PNodeTable nodes={paginatedNodes} />
      )}

      {/* Pagination */}
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