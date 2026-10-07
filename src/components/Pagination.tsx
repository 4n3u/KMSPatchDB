import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border border-neutral-950 bg-white p-3 text-xs dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row">
      <div className="flex items-center gap-2">
        <span className="text-neutral-600 dark:text-neutral-400">페이지 당 항목:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-neutral-950 bg-white px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
        >
          <option value={24}>24개</option>
          <option value={48}>48개</option>
          <option value={96}>96개</option>
          <option value={192}>192개</option>
        </select>
        <span className="text-neutral-500 dark:text-neutral-400">
          ({currentPage} / {totalPages} 페이지)
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex h-7 w-7 items-center justify-center border border-neutral-950 bg-white hover:bg-neutral-100 disabled:opacity-30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800 transition-colors"
          title="첫 페이지"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-7 w-7 items-center justify-center border border-neutral-950 bg-white hover:bg-neutral-100 disabled:opacity-30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800 transition-colors"
          title="이전 페이지"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* Current page indicator */}
        <span className="px-2 font-mono font-bold text-neutral-950 dark:text-white">
          {currentPage}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-7 w-7 items-center justify-center border border-neutral-950 bg-white hover:bg-neutral-100 disabled:opacity-30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800 transition-colors"
          title="다음 페이지"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex h-7 w-7 items-center justify-center border border-neutral-950 bg-white hover:bg-neutral-100 disabled:opacity-30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800 transition-colors"
          title="마지막 페이지"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
