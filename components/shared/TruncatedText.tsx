import { CopyButton } from './CopyButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  showCopy?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function TruncatedText({
  text,
  maxLength = 8,
  showCopy = true,
  showTooltip = true,
  className,
}: TruncatedTextProps) {
  const truncated =
    text.length > maxLength * 2
      ? `${text.slice(0, maxLength)}...${text.slice(-maxLength)}`
      : text;

  const content = (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <span className="font-mono text-sm">{truncated}</span>
      {showCopy && <CopyButton value={text} />}
    </div>
  );

  if (!showTooltip || text.length <= maxLength * 2) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{content}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs break-all font-mono text-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}