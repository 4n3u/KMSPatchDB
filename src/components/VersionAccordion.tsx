import * as React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { PatchItem } from '../types/patch';
import { formatBytes, formatDate, formatDateShort } from '../lib/utils';
import { ArrowRight, Search, Download, Copy, Check, Calendar } from 'lucide-react';

interface VersionGroup {
  targetVer: number;
  targetDisplay: string;
  server: 'KMS' | 'KMST';
  latestDate: string;
  majors: PatchItem[];
  minors: PatchItem[];
}

interface VersionAccordionProps {
  patches: PatchItem[];
  server: 'KMS' | 'KMST';
}

export const VersionAccordion: React.FC<VersionAccordionProps> = ({
  patches,
  server,
}) => {
  const [search, setSearch] = React.useState('');
  const [filterType, setFilterType] = React.useState<'all' | 'major' | 'minor'>('all');

  const serverPatches = React.useMemo(() => {
    return patches.filter((p) => p.server === server);
  }, [patches, server]);

  const groups: VersionGroup[] = React.useMemo(() => {
    const map = new Map<number, VersionGroup>();

    serverPatches.forEach((patch) => {
      if (!map.has(patch.targetVer)) {
        let display = patch.targetDisplay;
        if (patch.type === 'minor') {
          const match = display.match(/^(1\.2\.\d+)/);
          if (match) display = match[1];
        }
        map.set(patch.targetVer, {
          targetVer: patch.targetVer,
          targetDisplay: display,
          server: patch.server,
          latestDate: patch.lastModified,
          majors: [],
          minors: [],
        });
      }

      const group = map.get(patch.targetVer)!;
      if (patch.type === 'major') {
        group.majors.push(patch);
      } else {
        group.minors.push(patch);
      }
    });

    // Sort majors & minors within each group
    map.forEach((g) => {
      // Major: latest source version first
      g.majors.sort((a, b) => b.sourceVer - a.sourceVer);
      // Minor: latest target minor first, then latest source minor first
      g.minors.sort((a, b) => {
        const tDiff = (b.targetMinor || 0) - (a.targetMinor || 0);
        if (tDiff !== 0) return tDiff;
        return (b.sourceMinor || 0) - (a.sourceMinor || 0);
      });
    });

    return Array.from(map.values()).sort((a, b) => b.targetVer - a.targetVer);
  }, [serverPatches]);

  const filteredGroups = React.useMemo(() => {
    return groups
      .map((g) => {
        let majors = g.majors;
        let minors = g.minors;

        if (filterType === 'major') minors = [];
        if (filterType === 'minor') majors = [];

        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const matchesTitle = g.targetDisplay.toLowerCase().includes(q) || g.targetVer.toString().includes(q);
          if (!matchesTitle) {
            majors = majors.filter((p) => p.filename.toLowerCase().includes(q) || p.sourceDisplay.toLowerCase().includes(q));
            minors = minors.filter((p) => p.filename.toLowerCase().includes(q) || p.sourceDisplay.toLowerCase().includes(q));
          }
        }

        return {
          ...g,
          majors,
          minors,
        };
      })
      .filter((g) => g.majors.length > 0 || g.minors.length > 0);
  }, [groups, search, filterType]);

  const defaultOpenVal = groups.length > 0 ? `ver-${groups[0].targetVer}` : undefined;

  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const handleCopy = (url: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-3">
        {/* Search and filter pills */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search version (e.g. 419, 418)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>

          {/* Filter Pills */}
          <div className="inline-flex h-8 items-center rounded-lg bg-muted p-1 text-muted-foreground">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`rounded-md px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors ${
                filterType === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'hover:text-foreground'
              }`}
            >
              All Patches
            </button>
            <button
              type="button"
              onClick={() => setFilterType('major')}
              className={`rounded-md px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors ${
                filterType === 'major'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'hover:text-foreground'
              }`}
            >
              Major Only
            </button>
            <button
              type="button"
              onClick={() => setFilterType('minor')}
              className={`rounded-md px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors ${
                filterType === 'minor'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'hover:text-foreground'
              }`}
            >
              Minor Only
            </button>
          </div>
        </div>

        {/* Accordion List */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-xs">
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No patch versions found matching the search criteria.
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              defaultValue={defaultOpenVal}
              className="w-full"
            >
              {filteredGroups.map((group, idx) => {
                const isFirst = idx === 0 && !search.trim();

                return (
                  <AccordionItem
                    key={group.targetVer}
                    value={`ver-${group.targetVer}`}
                    className="px-4 last:border-b-0"
                  >
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex items-center gap-2.5 text-left">
                        <span className="text-sm font-semibold text-foreground">
                          v{group.targetDisplay}
                        </span>
                        {isFirst && (
                          <Badge variant="default" className="text-[10px] h-4.5 px-1.5 font-normal">
                            Latest
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          ({formatDateShort(group.latestDate)})
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-1 pb-4">
                      <div className="space-y-3">
                        {/* Major Patches */}
                        {group.majors.length > 0 && (
                          <div>
                            <span className="mb-1.5 block text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                              Major Updates
                            </span>
                            <div className="divide-y rounded-lg border bg-background/50">
                              {group.majors.map((patch) => (
                                <div
                                  key={patch.id}
                                  className="flex flex-col gap-2 p-2.5 sm:flex-row sm:items-center sm:justify-between text-xs hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                                      <span>{patch.sourceDisplay}</span>
                                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                      <span className="font-semibold text-foreground">
                                        {patch.targetDisplay}
                                      </span>
                                    </div>
                                    <span className="font-mono text-[11px] text-muted-foreground">
                                      ({patch.filename})
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                                    {/* Date */}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap cursor-help hover:text-foreground transition-colors">
                                          <Calendar className="h-3 w-3" />
                                          <span className="underline decoration-dotted underline-offset-2">
                                            {formatDateShort(patch.lastModified)}
                                          </span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        <div className="text-[11px]">
                                          <p className="font-semibold">{formatDate(patch.lastModified)}</p>
                                          <p className="text-[10px] text-primary-foreground/80 font-mono mt-0.5">{patch.lastModified}</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>

                                    {/* File Size */}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="font-mono font-medium text-foreground whitespace-nowrap cursor-help underline decoration-dotted underline-offset-2">
                                          {formatBytes(patch.sizeBytes)}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        <span className="font-mono text-[11px]">
                                          {patch.sizeBytes.toLocaleString()} Bytes
                                        </span>
                                      </TooltipContent>
                                    </Tooltip>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1.5">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => handleCopy(patch.url, patch.id, e)}
                                        className="h-7 px-2 text-[11px]"
                                      >
                                        {copiedId === patch.id ? (
                                          <>
                                            <Check className="h-3 w-3 text-emerald-600 mr-1" />
                                            <span>Copied</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="h-3 w-3 mr-1" />
                                            <span>Copy URL</span>
                                          </>
                                        )}
                                      </Button>

                                      <Button asChild size="sm" className="h-7 px-2.5 text-[11px]">
                                        <a href={patch.url} download={patch.filename}>
                                          <Download className="h-3 w-3 mr-1" />
                                          <span>Download</span>
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Minor Patches */}
                        {group.minors.length > 0 && (
                          <div>
                            <span className="mb-1.5 block text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                              Minor Maintenance Updates
                            </span>
                            <div className="divide-y rounded-lg border bg-background/50">
                              {group.minors.map((patch) => (
                                <div
                                  key={patch.id}
                                  className="flex flex-col gap-2 p-2.5 sm:flex-row sm:items-center sm:justify-between text-xs hover:bg-muted/50 transition-colors"
                                >
                                  {/* Clean Minor display without repeating the major version */}
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                                      <span>Minor {patch.sourceMinor ?? patch.sourceDisplay}</span>
                                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                      <span className="font-semibold text-foreground">
                                        Minor {patch.targetMinor ?? patch.targetDisplay}
                                      </span>
                                    </div>
                                    <span className="font-mono text-[11px] text-muted-foreground">
                                      ({patch.filename})
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                                    {/* Date */}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap cursor-help hover:text-foreground transition-colors">
                                          <Calendar className="h-3 w-3" />
                                          <span className="underline decoration-dotted underline-offset-2">
                                            {formatDateShort(patch.lastModified)}
                                          </span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        <div className="text-[11px]">
                                          <p className="font-semibold">{formatDate(patch.lastModified)}</p>
                                          <p className="text-[10px] text-primary-foreground/80 font-mono mt-0.5">{patch.lastModified}</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>

                                    {/* File Size */}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="font-mono font-medium text-foreground whitespace-nowrap cursor-help underline decoration-dotted underline-offset-2">
                                          {formatBytes(patch.sizeBytes)}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        <span className="font-mono text-[11px]">
                                          {patch.sizeBytes.toLocaleString()} Bytes
                                        </span>
                                      </TooltipContent>
                                    </Tooltip>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1.5">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => handleCopy(patch.url, patch.id, e)}
                                        className="h-7 px-2 text-[11px]"
                                      >
                                        {copiedId === patch.id ? (
                                          <>
                                            <Check className="h-3 w-3 text-emerald-600 mr-1" />
                                            <span>Copied</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="h-3 w-3 mr-1" />
                                            <span>Copy URL</span>
                                          </>
                                        )}
                                      </Button>

                                      <Button asChild size="sm" className="h-7 px-2.5 text-[11px]">
                                        <a href={patch.url} download={patch.filename}>
                                          <Download className="h-3 w-3 mr-1" />
                                          <span>Download</span>
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
