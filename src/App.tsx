import * as React from 'react';
import { Header } from './components/Header';
import { VersionAccordion } from './components/VersionAccordion';
import { Button } from './components/ui/button';
import { PatchItem } from './types/patch';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [patches, setPatches] = React.useState<PatchItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Active Server tab (KMS / KMST)
  const [server, setServer] = React.useState<'KMS' | 'KMST'>('KMS');

  // Dark Mode State
  const [darkMode, setDarkMode] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Load Data
  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const patchesRes = await fetch('./data/patches.json?t=' + Date.now());
      if (!patchesRes.ok) {
        throw new Error(`Failed to load patch database (Status: ${patchesRes.status})`);
      }

      const patchesData: PatchItem[] = await patchesRes.json();
      setPatches(patchesData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-muted selection:text-foreground">
      <Header
        server={server}
        onServerChange={setServer}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        {loading && patches.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border bg-card">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Loading patch database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
            <AlertCircle className="h-6 w-6" />
            <p className="text-xs font-semibold">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="mt-2 text-xs"
            >
              Retry
            </Button>
          </div>
        ) : (
          <VersionAccordion
            patches={patches}
            server={server}
          />
        )}
      </main>
    </div>
  );
}
