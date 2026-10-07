export interface PatchItem {
  id: string;
  server: 'KMS' | 'KMST';
  type: 'major' | 'minor';
  url: string;
  filename: string;
  sizeBytes: number;
  sizeMb: number;
  lastModified: string;
  timestamp: string;
  targetVer: number;
  sourceVer: number;
  sourceMinor?: number | null;
  targetMinor?: number | null;
  sourceDisplay: string;
  targetDisplay: string;
}

export interface ServerSummary {
  total: number;
  major: number;
  minor: number;
  latestVer: number;
  latestDisplay: string;
  totalSizeMb: number;
}

export interface PatchSummary {
  updatedAt: string;
  totalPatches: number;
  kms: ServerSummary;
  kmst: ServerSummary;
}
