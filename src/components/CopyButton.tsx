import * as React from 'react';
import { Tooltip } from '@base-ui/react/tooltip';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, label = 'URL 복사', className = '' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          type="button"
          onClick={handleCopy}
          className={`flex h-7 items-center gap-1 border border-neutral-950 bg-white px-2 text-[11px] font-medium text-neutral-950 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors ${className}`}
          aria-label={label}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>{label}</span>
            </>
          )}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6} className="z-50">
            <Tooltip.Popup className="border border-neutral-950 bg-neutral-950 px-2 py-1 text-[11px] font-medium text-white shadow-sm dark:border-white dark:bg-white dark:text-neutral-950 transition-opacity">
              {copied ? '클립보드에 복사 완료!' : `${label} 클릭`}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
