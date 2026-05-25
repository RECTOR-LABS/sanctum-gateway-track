/**
 * Build Information API Route
 *
 * Returns current build version and git commit info.
 * Prefers Vercel-provided env vars; falls back to local git CLI for dev.
 */

import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

function tryGit(args: string): string | null {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

export async function GET() {
  const gitHash =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_GIT_SHA ||
    tryGit('rev-parse HEAD');

  const gitBranch =
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.NEXT_PUBLIC_GIT_BRANCH ||
    tryGit('rev-parse --abbrev-ref HEAD') ||
    'unknown';

  const gitMessage =
    process.env.VERCEL_GIT_COMMIT_MESSAGE ||
    tryGit('log -1 --format=%s') ||
    '';

  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();

  return NextResponse.json({
    version: '1.0.0',
    git: gitHash
      ? {
          hash: gitHash,
          short: gitHash.slice(0, 7),
          branch: gitBranch,
          message: gitMessage,
        }
      : null,
    build: {
      time: buildTime,
      env: process.env.NEXT_PUBLIC_ENV || process.env.VERCEL_ENV || 'development',
      nextVersion: process.env.npm_package_dependencies_next || 'unknown',
    },
    timestamp: new Date().toISOString(),
  });
}
