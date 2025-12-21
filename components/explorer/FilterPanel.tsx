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
import { cn } from '@/lib/utils';

/* ---------------------------------------------
   Types
--------------------------------------------- */
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

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function FilterPanel({
  filters,
  onChange,
  availableVersions = [],
}: FilterPanelProps) {
  const [open, setOpen] = React.useState(false);

  const activeCount = React.useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.version && filters.version !== 'all') count++;
    if (filters.minStorage > 0) count++;
    if (filters.maxStorage < Infinity) count++;
    return count;
  }, [filters]);

  const safeVersions = Array.isArray(availableVersions)
    ? availableVersions
    : [];


  const resetFilters = () => {
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
    <div className="flex items-center gap-2 flex-wrap">
      {/* -----------------------------------------
          Sort
      ----------------------------------------- */}
      <Select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onValueChange={(v) => {
          const [sortBy, sortOrder] = v.split('-') as [
            FilterState['sortBy'],
            FilterState['sortOrder']
          ];
          onChange({ ...filters, sortBy, sortOrder });
        }}
      >
        <SelectTrigger className="w-[190px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
          <SelectContent
            className="
              bg-background
              dark:bg-[#0F1535]
            "
          >
          <SelectItem value="health-desc">Health · High → Low</SelectItem>
          <SelectItem value="health-asc">Health · Low → High</SelectItem>
          <SelectItem value="storage-desc">Storage · High → Low</SelectItem>
          <SelectItem value="storage-asc">Storage · Low → High</SelectItem>
          <SelectItem value="uptime-desc">Uptime · High → Low</SelectItem>
          <SelectItem value="uptime-asc">Uptime · Low → High</SelectItem>
          <SelectItem value="version-desc">Version · Newest</SelectItem>
          <SelectItem value="version-asc">Version · Oldest</SelectItem>
        </SelectContent>
      </Select>

      {/* -----------------------------------------
          Filters Dropdown
      ----------------------------------------- */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'gap-2',
              activeCount > 0 && 'border-blue-500/40'
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {activeCount}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className={cn(
            'w-[320px] rounded-xl p-4',
            'bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]',
            'dark:bg-[#0A0E27]/95 dark:backdrop-blur-xl',
            'dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]'
          )}
        >
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filters</span>
              {activeCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              )}
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(v) =>
                  onChange({ ...filters, status: v as FilterState['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="
                    bg-background
                    dark:bg-[#0F1535]
                  "
                >
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Version */}
            {safeVersions.length > 0 && (
              <div className="space-y-2">
                <Label>Version</Label>
                <Select
                  value={filters.version}
                  onValueChange={(v) => onChange({ ...filters, version: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className="
                      bg-background
                      dark:bg-[#0F1535]
                    "
                  >
                    <SelectItem value="all">All</SelectItem>
                    {safeVersions.map((v) => (
                      <SelectItem key={v} value={v}>
                        v{v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Storage */}
            <div className="space-y-2">
              <Label>Storage (GB)</Label>
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

      {/* -----------------------------------------
          Active Filter Pills
      ----------------------------------------- */}
      {activeCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.status}
              <button onClick={() => onChange({ ...filters, status: 'all' })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.version && filters.version !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              v{filters.version}
              <button onClick={() => onChange({ ...filters, version: 'all' })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}