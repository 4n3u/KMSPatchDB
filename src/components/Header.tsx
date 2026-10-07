import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  server: 'KMS' | 'KMST';
  onServerChange: (server: 'KMS' | 'KMST') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  server,
  onServerChange,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Strictly 'KMSPatchDB' only */}
        <span className="text-base font-bold tracking-tight text-foreground">
          KMSPatchDB
        </span>

        {/* Server Tabs & Dark Mode Toggle */}
        <div className="flex items-center gap-3">
          <Tabs
            value={server}
            onValueChange={(val) => onServerChange(val as 'KMS' | 'KMST')}
          >
            <TabsList className="h-8">
              <TabsTrigger value="KMS" className="text-xs h-7">
                KMS (Live)
              </TabsTrigger>
              <TabsTrigger value="KMST" className="text-xs h-7">
                KMST (Test)
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="h-8 w-8"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
