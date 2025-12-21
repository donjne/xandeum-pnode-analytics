'use client';

import * as React from 'react';
import { SearchBar, FilterPanel, PNodeGrid, PNodeTable, Pagination, FilterState } from '@/components/explorer';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Table as TableIcon, Settings } from 'lucide-react';
import { useNetworkReady } from '@/hooks/use-network-ready';
import { useNetworkStore } from '@/stores/networkStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ExplorerPage() {
  const { isLoading } = useNetworkReady();
  const { nodes } = useNetworkStore();
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

  // Add debugging
  React.useEffect(() => {
    console.log('ExplorerPage - nodes:', nodes);
    console.log('ExplorerPage - nodes type:', typeof nodes);
    console.log('ExplorerPage - nodes is array:', Array.isArray(nodes));
  }, [nodes]);

  // Filter nodes based on search and filters
  const filteredNodes = React.useMemo(() => {
    console.log('filteredNodes memo - nodes:', nodes);
    
    // More defensive check
    if (!Array.isArray(nodes) || nodes.length === 0) {
      console.log('filteredNodes memo - returning empty array');
      return [];
    }
    
    let result = [...nodes];
    console.log('filteredNodes memo - result after spread:', result);

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (node) =>
          node?.pubkey?.toLowerCase().includes(searchLower) ||
          node?.address?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((node) => node?.status === filters.status);
    }

    // Version filter
    if (filters.version && filters.version !== 'all') {
      result = result.filter((node) => node?.version === filters.version);
    }

    // Storage range filter
    if (filters.minStorage && filters.minStorage > 0) {
      const min = filters.minStorage * 1073741824; // GB to bytes
      result = result.filter((node) => (node?.storage_committed || 0) >= min);
    }
    if (filters.maxStorage && filters.maxStorage > 0 && filters.maxStorage !== Infinity) {
      const max = filters.maxStorage * 1073741824; // GB to bytes
      result = result.filter((node) => (node?.storage_committed || 0) <= max);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (filters.sortBy) {
        case 'health':
          aVal = a?.health_score || 0;
          bVal = b?.health_score || 0;
          break;
        case 'uptime':
          aVal = a?.uptime || 0;
          bVal = b?.uptime || 0;
          break;
        case 'storage':
          aVal = a?.storage_committed || 0;
          bVal = b?.storage_committed || 0;
          break;
        case 'utilization':
          aVal = (a?.storage_used || 0) / (a?.storage_committed || 1);
          bVal = (b?.storage_used || 0) / (b?.storage_committed || 1);
          break;
        case 'lastSeen':
          aVal = a?.last_seen_timestamp || 0;
          bVal = b?.last_seen_timestamp || 0;
          break;
        case 'version':
          aVal = a?.version || '';
          bVal = b?.version || '';
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

    console.log('filteredNodes memo - final result:', result);
    return result;
  }, [nodes, search, filters]);

  // Pagination - with extensive null safety
  const totalPages = React.useMemo(() => {
    const length = Array.isArray(filteredNodes) ? filteredNodes.length : 0;
    const pages = Math.max(1, Math.ceil(length / pageSize));
    console.log('totalPages calc - filteredNodes.length:', length, 'totalPages:', pages);
    return pages;
  }, [filteredNodes, pageSize]);

  const paginatedNodes = React.useMemo(() => {
    console.log('paginatedNodes memo - filteredNodes:', filteredNodes);
    console.log('paginatedNodes memo - page:', page, 'pageSize:', pageSize);
    
    if (!Array.isArray(filteredNodes) || filteredNodes.length === 0) {
      console.log('paginatedNodes memo - returning empty array');
      return [];
    }
    
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    const result = filteredNodes.slice(start, end);
    
    console.log('paginatedNodes memo - slice from', start, 'to', end, 'result:', result);
    return result;
  }, [filteredNodes, page, pageSize]);

  // Reset page when filters change
  React.useEffect(() => {
    console.log('Resetting page to 1 due to filter/search change');
    setPage(1);
  }, [search, filters]);

  console.log('ExplorerPage render - isLoading:', isLoading);
  console.log('ExplorerPage render - nodes:', nodes);
  console.log('ExplorerPage render - filteredNodes:', filteredNodes);
  console.log('ExplorerPage render - paginatedNodes:', paginatedNodes);

  if (isLoading) {
    return null;
  }

  if (!Array.isArray(nodes) || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No pNodes found</p>
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
        Showing {paginatedNodes?.length || 0} of {filteredNodes?.length || 0} nodes
        {search || filters.status !== 'all' ? ' (filtered)' : ''}
      </div>

      {/* Node Grid or Table */}
      {viewMode === 'grid' ? (
        <PNodeGrid
          nodes={paginatedNodes || []}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      ) : (
        <PNodeTable nodes={paginatedNodes || []} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredNodes?.length || 0}
          onPageChange={(newPage) => {
            console.log('onPageChange called with:', newPage);
            setPage(newPage);
          }}
          onPageSizeChange={(size) => {
            console.log('onPageSizeChange called with:', size);
            setPageSize(size);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}