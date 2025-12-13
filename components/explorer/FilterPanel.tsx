'use client';

import * as React from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Filter state for pNode explorer
export interface FilterState {
  status: 'all' | 'online' | 'offline';
  version: string;
  minStorage: number;
  maxStorage: number;
  sortBy: 'health' | 'storage' | 'uptime' | 'version' | 'utilization' | 'lastSeen';
  sortOrder: 'asc' | 'desc';
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableVersions?: string[];
}

export function FilterPanel({ filters, onChange, availableVersions = [] }: FilterPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.version !== 'all') count++;
    if (filters.minStorage > 0) count++;
    if (filters.maxStorage < Infinity) count++;
    return count;
  }, [filters]);

  const handleReset = () => {
    onChange({
      status: 'all',
      version: 'all',
      minStorage: 0,
      maxStorage: Infinity,
      sortBy: 'health',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Sort dropdown */}
      <Select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onValueChange={(value) => {
          const [sortBy, sortOrder] = value.split('-') as [FilterState['sortBy'], FilterState['sortOrder']];
          onChange({ ...filters, sortBy, sortOrder });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="health-desc">Health (High to Low)</SelectItem>
          <SelectItem value="health-asc">Health (Low to High)</SelectItem>
          <SelectItem value="storage-desc">Storage (High to Low)</SelectItem>
          <SelectItem value="storage-asc">Storage (Low to High)</SelectItem>
          <SelectItem value="uptime-desc">Uptime (High to Low)</SelectItem>
          <SelectItem value="uptime-asc">Uptime (Low to High)</SelectItem>
          <SelectItem value="version-desc">Version (Newest First)</SelectItem>
          <SelectItem value="version-asc">Version (Oldest First)</SelectItem>
        </SelectContent>
      </Select>

      {/* Advanced filters dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </div>

            <Separator />

            {/* Status filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  onChange({ ...filters, status: value as FilterState['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Nodes</SelectItem>
                  <SelectItem value="online">Online Only</SelectItem>
                  <SelectItem value="offline">Offline Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Version filter */}
            {availableVersions.length > 0 && (
              <div className="space-y-2">
                <Label>Version</Label>
                <Select
                  value={filters.version}
                  onValueChange={(value) => onChange({ ...filters, version: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Versions</SelectItem>
                    {availableVersions.map((version) => (
                      <SelectItem key={version} value={version}>
                        v{version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Storage range */}
            <div className="space-y-2">
              <Label>Storage Range (GB)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minStorage || ''}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      minStorage: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxStorage === Infinity ? '' : filters.maxStorage}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      maxStorage: parseInt(e.target.value) || Infinity,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.status}
              <button
                onClick={() => onChange({ ...filters, status: 'all' })}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.version !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              v{filters.version}
              <button
                onClick={() => onChange({ ...filters, version: 'all' })}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}