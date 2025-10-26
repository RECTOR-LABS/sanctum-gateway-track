'use client';

import { useEffect, useState } from 'react';

interface BuildInfo {
  git: {
    short: string;
    branch: string;
  };
}

export function Footer() {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);

  useEffect(() => {
    fetch('/api/build-info')
      .then((res) => res.json())
      .then((data) => setBuildInfo(data))
      .catch(() => setBuildInfo(null));
  }, []);

  return (
    <footer className="border-t py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built for{' '}
          <a
            href="https://earn.superteam.fun/listing/sanctum-gateway-track"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Sanctum Gateway Track
          </a>
          . Powered by{' '}
          <a
            href="https://gateway.sanctum.so"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Gateway API
          </a>
          .
        </p>

        {buildInfo && (
          <p className="text-xs text-muted-foreground">
            <a
              href={`https://github.com/RECTOR-LABS/sanctum-gateway-track/commit/${buildInfo.git.short}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:underline"
              title={`Branch: ${buildInfo.git.branch}`}
            >
              {buildInfo.git.short}
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
