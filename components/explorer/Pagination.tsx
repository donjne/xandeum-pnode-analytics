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
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
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
          Showing{' '}
          <span className="font-medium text-foreground">{startItem}</span>–
          <span className="font-medium text-foreground">{endItem}</span> of{' '}
          <span className="font-medium text-foreground">{totalItems}</span>
        </p>

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="h-8 w-[72px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
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
          onClick={() => onPageChange(1)}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span
                key={index}
                className="px-2 text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(page as number)}
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
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={!canGoNext}
          onClick={() => onPageChange(totalPages)}
          className="h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
