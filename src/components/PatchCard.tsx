import * as React from 'react';
import { PatchItem } from '../types/patch';
import { formatBytes, formatDate } from '../lib/utils';
import { Download, ArrowRight, Info, FileCode } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface PatchCardProps {
  patch: PatchItem;
  onSelect: (patch: PatchItem) => void;
}

export const PatchCard: React.FC<PatchCardProps> = ({ patch, onSelect }) => {
  return (
    <div className="group relative flex flex-col justify-between border border-neutral-950 bg-white p-4 shadow-[2px_2px_0] shadow-neutral-950 hover:shadow-[3px_3px_0] hover:shadow-neutral-950 transition-all dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:border-neutral-600">
      {/* Header tags */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                patch.server === 'KMS'
                  ? 'border border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  : 'border border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
              }`}
            >
              {patch.server}
            </span>
            <span
              className={`px-1.5 py-0.2 text-[10px] font-semibold ${
                patch.type === 'major'
                  ? 'border border-neutral-300 bg-neutral-100 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                  : 'border border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {patch.type === 'major' ? 'Major' : 'Minor'}
            </span>
          </div>

          <span className="font-mono text-xs font-semibold text-neutral-950 dark:text-white">
            {formatBytes(patch.sizeBytes)}
          </span>
        </div>

        {/* Version transition */}
        <div className="mt-3 flex items-center gap-2">
          <span className="border border-neutral-950 bg-neutral-50 px-2 py-0.5 text-xs font-bold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200">
            {patch.sourceDisplay}
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
          <span className="border border-neutral-950 bg-neutral-950 px-2 py-0.5 text-xs font-bold text-white dark:border-white dark:bg-white dark:text-neutral-950">
            {patch.targetDisplay}
          </span>
        </div>

        {/* Filename & Last Modified */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300">
            <FileCode className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
            <span className="truncate">{patch.filename}</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            CDN 등록: {formatDate(patch.lastModified)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => onSelect(patch)}
          className="flex h-7 items-center gap-1 border border-neutral-950 bg-neutral-50 px-2 text-[11px] font-medium text-neutral-950 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <Info className="h-3 w-3" />
          <span>상세/명령어</span>
        </button>

        <div className="flex items-center gap-1.5">
          <CopyButton text={patch.url} />
          <a
            href={patch.url}
            download={patch.filename}
            className="flex h-7 items-center gap-1 border border-neutral-950 bg-neutral-950 px-2 text-[11px] font-medium text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
            title="다운로드"
          >
            <Download className="h-3 w-3" />
            <span>다운로드</span>
          </a>
        </div>
      </div>
    </div>
  );
};
