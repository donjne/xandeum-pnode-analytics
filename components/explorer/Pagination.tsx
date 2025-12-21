'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  pageSize = 25,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: PaginationProps) {
  // Add defensive checks
  React.useEffect(() => {
    console.log('Pagination render:', {
      currentPage,
      totalPages,
      pageSize,
      totalItems,
      pageSizeOptions,
    });
  }, [currentPage, totalPages, pageSize, totalItems, pageSizeOptions]);

  // Ensure we have valid values
  const safeCurrentPage = Math.max(1, currentPage || 1);
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safePageSize = Math.max(1, pageSize || 25);
  const safeTotalItems = Math.max(0, totalItems || 0);
  const safePageSizeOptions = Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0 
    ? pageSizeOptions 
    : [10, 25, 50, 100];

  const startItem = safeTotalItems > 0 ? (safeCurrentPage - 1) * safePageSize + 1 : 0;
  const endItem = Math.min(safeCurrentPage * safePageSize, safeTotalItems);

  const canGoPrevious = safeCurrentPage > 1;
  const canGoNext = safeCurrentPage < safeTotalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (safeCurrentPage > 3) pages.push('...');

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(safeTotalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (safeCurrentPage < safeTotalPages - 2) pages.push('...');

      pages.push(safeTotalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    console.log('handlePageChange:', page);
    if (typeof onPageChange === 'function') {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (value: string) => {
    console.log('handlePageSizeChange:', value);
    if (typeof onPageSizeChange === 'function') {
      const newSize = parseInt(value, 10);
      if (!isNaN(newSize)) {
        onPageSizeChange(newSize);
      }
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        // surface
        'rounded-2xl px-4 py-3',
        // light
        'bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)]',
        // dark
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]',
        className
      )}
    >
      {/* Left: info + page size */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        <p className="text-sm text-muted-foreground">
          {safeTotalItems > 0 ? (
            <>
              Showing{' '}
              <span className="font-medium text-foreground">{startItem}</span>–
              <span className="font-medium text-foreground">{endItem}</span> of{' '}
              <span className="font-medium text-foreground">{safeTotalItems}</span>
            </>
          ) : (
            'No items'
          )}
        </p>

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Per page</span>
            <Select
              value={safePageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[72px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {safePageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Right: controls */}
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={!canGoPrevious}
          onClick={() => handlePageChange(1)}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={!canGoPrevious}
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={`page-${page}`}
                variant={safeCurrentPage === page ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePageChange(page as number)}
                className="h-8 w-8"
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          disabled={!canGoNext}
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={!canGoNext}
          onClick={() => handlePageChange(safeTotalPages)}
          className="h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}