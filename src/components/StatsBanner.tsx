import * as React from 'react';
import { PatchSummary } from '../types/patch';
import { Server, Sparkles, Clock, HardDrive, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface StatsBannerProps {
  summary: PatchSummary | null;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Patches */}
      <div className="flex flex-col justify-between border border-neutral-950 bg-white p-4 shadow-[2px_2px_0] shadow-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
        <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
          <span className="text-xs font-semibold uppercase tracking-wider">전체 가용 패치 파일</span>
          <HardDrive className="h-4 w-4" />
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              {summary.totalPatches.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-500">개 파일</span>
          </div>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            총 {((summary.kms.totalSizeMb + summary.kmst.totalSizeMb) / 1024).toFixed(1)} GB CDN 보관 중
          </p>
        </div>
      </div>

      {/* KMS Latest */}
      <div className="flex flex-col justify-between border border-neutral-950 bg-white p-4 shadow-[2px_2px_0] shadow-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="border border-amber-600 bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 dark:text-amber-400">
              KMS 본서버
            </span>
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">최신 버전</span>
          </div>
          <Sparkles className="h-4 w-4 text-amber-500" />
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              {summary.kms.latestDisplay}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            Major {summary.kms.major}개 · Minor {summary.kms.minor}개 (총 {summary.kms.total}개)
          </p>
        </div>
      </div>

      {/* KMST Latest */}
      <div className="flex flex-col justify-between border border-neutral-950 bg-white p-4 shadow-[2px_2px_0] shadow-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="border border-indigo-600 bg-indigo-500/10 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700 dark:text-indigo-400">
              KMST 테스트서버
            </span>
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">최신 버전</span>
          </div>
          <Server className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              {summary.kmst.latestDisplay}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            Major {summary.kmst.major}개 · Minor {summary.kmst.minor}개 (총 {summary.kmst.total}개)
          </p>
        </div>
      </div>

      {/* Automation Status */}
      <div className="flex flex-col justify-between border border-neutral-950 bg-white p-4 shadow-[2px_2px_0] shadow-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
        <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
          <span className="text-xs font-semibold uppercase tracking-wider">자동 동기화 주기</span>
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold text-neutral-950 dark:text-white">
              GitHub Actions 6시간마다 갱신
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">최근 갱신: {formatDate(summary.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
