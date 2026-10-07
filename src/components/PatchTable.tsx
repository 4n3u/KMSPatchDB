import * as React from 'react';
import { PatchItem } from '../types/patch';
import { formatBytes, formatDate } from '../lib/utils';
import { Download, ArrowRight, Info } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface PatchTableProps {
  patches: PatchItem[];
  onSelect: (patch: PatchItem) => void;
}

export const PatchTable: React.FC<PatchTableProps> = ({ patches, onSelect }) => {
  return (
    <div className="overflow-x-auto border border-neutral-950 bg-white shadow-[2px_2px_0] shadow-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-neutral-950 bg-neutral-100 font-semibold uppercase tracking-wider text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
          <tr>
            <th className="px-3 py-2.5">서버</th>
            <th className="px-3 py-2.5">유형</th>
            <th className="px-3 py-2.5">업데이트 경로</th>
            <th className="px-3 py-2.5">파일명</th>
            <th className="px-3 py-2.5">용량</th>
            <th className="px-3 py-2.5">등록일시</th>
            <th className="px-3 py-2.5 text-right">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 font-normal text-neutral-950 dark:divide-neutral-800 dark:text-neutral-200">
          {patches.map((patch) => (
            <tr
              key={patch.id}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <td className="px-3 py-2.5">
                <span
                  className={`inline-block px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                    patch.server === 'KMS'
                      ? 'border border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                      : 'border border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                  }`}
                >
                  {patch.server}
                </span>
              </td>
              <td className="px-3 py-2.5">
                <span
                  className={`inline-block px-1.5 py-0.2 text-[10px] font-semibold ${
                    patch.type === 'major'
                      ? 'border border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      : 'border border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {patch.type === 'major' ? 'Major' : 'Minor'}
                </span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5 font-medium">
                  <span>{patch.sourceDisplay}</span>
                  <ArrowRight className="h-3 w-3 text-neutral-400" />
                  <span className="font-bold">{patch.targetDisplay}</span>
                </div>
              </td>
              <td className="px-3 py-2.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                {patch.filename}
              </td>
              <td className="px-3 py-2.5 font-mono font-medium whitespace-nowrap">
                {formatBytes(patch.sizeBytes)}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-neutral-600 dark:text-neutral-400 text-[11px]">
                {formatDate(patch.lastModified)}
              </td>
              <td className="px-3 py-2.5 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onSelect(patch)}
                    className="flex h-6 items-center gap-1 border border-neutral-950 bg-neutral-50 px-1.5 text-[10px] font-medium text-neutral-950 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Info className="h-3 w-3" />
                    <span>상세</span>
                  </button>
                  <CopyButton text={patch.url} label="복사" className="h-6 text-[10px] px-1.5" />
                  <a
                    href={patch.url}
                    download={patch.filename}
                    className="flex h-6 items-center gap-1 border border-neutral-950 bg-neutral-950 px-2 text-[10px] font-medium text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>다운</span>
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
