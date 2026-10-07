import * as React from 'react';
import { Tabs } from '@base-ui/react/tabs';
import { Select } from '@base-ui/react/select';
import { Search, ChevronDown, Check, ArrowUpDown, Filter } from 'lucide-react';

interface FilterBarProps {
  serverFilter: 'ALL' | 'KMS' | 'KMST';
  onServerFilterChange: (val: 'ALL' | 'KMS' | 'KMST') => void;
  typeFilter: 'all' | 'major' | 'minor';
  onTypeFilterChange: (val: 'all' | 'major' | 'minor') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortOption: string;
  onSortChange: (opt: string) => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  totalFilteredCount: number;
}

const sortItems = [
  { label: '최신 버전 순 (기본)', value: 'latest-ver' },
  { label: '이전 버전 순', value: 'oldest-ver' },
  { label: '최근 갱신일시 순', value: 'latest-date' },
  { label: '파일 용량 큰 순', value: 'size-desc' },
  { label: '파일 용량 작은 순', value: 'size-asc' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  serverFilter,
  onServerFilterChange,
  typeFilter,
  onTypeFilterChange,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
}) => {
  return (
    <div className="flex flex-col gap-4 border border-neutral-950 bg-white p-4 shadow-[2px_2px_0] shadow-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
      {/* Top row: Server Tabs + Type Tabs */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Base UI Server Tabs */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">서버 선택:</span>
          <Tabs.Root
            value={serverFilter}
            onValueChange={(val) => onServerFilterChange(val as 'ALL' | 'KMS' | 'KMST')}
            className="w-full sm:w-auto"
          >
            <Tabs.List className="inline-flex border border-neutral-950 bg-neutral-100 p-0.5 dark:border-neutral-700 dark:bg-neutral-800">
              <Tabs.Tab
                value="ALL"
                className="px-3 py-1 text-xs font-semibold text-neutral-600 select-none hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white data-active:border data-active:border-neutral-950 data-active:bg-white data-active:text-neutral-950 dark:data-active:border-white dark:data-active:bg-neutral-950 dark:data-active:text-white transition-all cursor-pointer"
              >
                전체 서버
              </Tabs.Tab>
              <Tabs.Tab
                value="KMS"
                className="px-3 py-1 text-xs font-semibold text-neutral-600 select-none hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white data-active:border data-active:border-neutral-950 data-active:bg-white data-active:text-neutral-950 dark:data-active:border-white dark:data-active:bg-neutral-950 dark:data-active:text-white transition-all cursor-pointer"
              >
                KMS (본서버)
              </Tabs.Tab>
              <Tabs.Tab
                value="KMST"
                className="px-3 py-1 text-xs font-semibold text-neutral-600 select-none hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white data-active:border data-active:border-neutral-950 data-active:bg-white data-active:text-neutral-950 dark:data-active:border-white dark:data-active:bg-neutral-950 dark:data-active:text-white transition-all cursor-pointer"
              >
                KMST (테스트서버)
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </div>

        {/* Base UI Type Tabs */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">패치 유형:</span>
          <Tabs.Root
            value={typeFilter}
            onValueChange={(val) => onTypeFilterChange(val as 'all' | 'major' | 'minor')}
            className="w-full sm:w-auto"
          >
            <Tabs.List className="inline-flex border border-neutral-950 bg-neutral-100 p-0.5 dark:border-neutral-700 dark:bg-neutral-800">
              <Tabs.Tab
                value="all"
                className="px-3 py-1 text-xs font-semibold text-neutral-600 select-none hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white data-active:border data-active:border-neutral-950 data-active:bg-white data-active:text-neutral-950 dark:data-active:border-white dark:data-active:bg-neutral-950 dark:data-active:text-white transition-all cursor-pointer"
              >
                전체
              </Tabs.Tab>
              <Tabs.Tab
                value="major"
                className="px-3 py-1 text-xs font-semibold text-neutral-600 select-none hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white data-active:border data-active:border-neutral-950 data-active:bg-white data-active:text-neutral-950 dark:data-active:border-white dark:data-active:bg-neutral-950 dark:data-active:text-white transition-all cursor-pointer"
              >
                Major (버전 업데이트)
              </Tabs.Tab>
              <Tabs.Tab
                value="minor"
                className="px-3 py-1 text-xs font-semibold text-neutral-600 select-none hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white data-active:border data-active:border-neutral-950 data-active:bg-white data-active:text-neutral-950 dark:data-active:border-white dark:data-active:bg-neutral-950 dark:data-active:text-white transition-all cursor-pointer"
              >
                Minor (소수점/점검)
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </div>
      </div>

      {/* Bottom row: Search input + Base UI Select Sort + View toggles */}
      <div className="flex flex-col gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="버전 (예: 419, 1.2.419, 1206) 또는 파일명 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border border-neutral-950 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-neutral-400 focus:outline-2 focus:outline-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:outline-white"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Base UI Select for Sort */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-neutral-500" />
            <Select.Root
              items={sortItems}
              value={sortOption}
              onValueChange={(val) => {
                if (val) onSortChange(val as string);
              }}
            >
              <Select.Trigger className="flex h-8 items-center justify-between gap-2 border border-neutral-950 bg-white px-2.5 text-xs font-medium text-neutral-950 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800 cursor-pointer">
                <Select.Value placeholder="정렬 선택" />
                <Select.Icon>
                  <ChevronDown className="h-3 w-3 text-neutral-500" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner sideOffset={4} className="z-50">
                  <Select.Popup className="min-w-44 border border-neutral-950 bg-white p-1 text-xs shadow-[2px_2px_0] shadow-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-none">
                    <Select.List>
                      {sortItems.map((item) => (
                        <Select.Item
                          key={item.value}
                          value={item.value}
                          className="flex cursor-pointer items-center justify-between px-2.5 py-1.5 outline-hidden select-none data-highlighted:bg-neutral-950 data-highlighted:text-white dark:data-highlighted:bg-white dark:data-highlighted:text-neutral-950"
                        >
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator>
                            <Check className="h-3 w-3" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.List>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          </div>

          {/* View mode toggle */}
          <div className="flex border border-neutral-950 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`px-2.5 py-1 text-xs font-semibold ${
                viewMode === 'cards'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
              } transition-colors`}
            >
              카드
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`px-2.5 py-1 text-xs font-semibold ${
                viewMode === 'table'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
              } transition-colors`}
            >
              테이블
            </button>
          </div>
        </div>
      </div>

      {/* Filter status count */}
      <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Filter className="h-3 w-3" />
          <span>
            검색 결과: <strong className="text-neutral-900 dark:text-neutral-100">{totalFilteredCount.toLocaleString()}</strong> 개 파일
          </span>
        </div>
      </div>
    </div>
  );
};
