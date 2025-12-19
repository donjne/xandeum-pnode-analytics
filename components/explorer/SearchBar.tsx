'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search by pubkey, address, or version…',
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        'relative flex items-center',
        // container surface
        'rounded-xl transition-shadow',
        // light mode
        'bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]',
        // dark mode
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]',
        className
      )}
    >
      {/* Search icon */}
      <Search className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground" />

      {/* Input */}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-11 w-full border-0 bg-transparent pl-11 pr-10',
          'focus-visible:ring-0 focus-visible:ring-offset-0',
          'text-sm'
        )}
      />

      {/* Clear button */}
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange('')}
          className="absolute right-2 h-7 w-7 rounded-full"
        >
          <X className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
