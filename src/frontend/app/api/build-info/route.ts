/**
 * Build Information API Route
 *
 * Returns current build version and git commit info
 */

import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get git information
    const gitHash = process.env.NEXT_PUBLIC_GIT_SHA ||
                   execSync('git rev-parse HEAD').toString().trim();
    const gitShort = gitHash.slice(0, 7);
    const gitBranch = process.env.NEXT_PUBLIC_GIT_BRANCH ||
                     execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const gitMessage = execSync('git log -1 --format=%s').toString().trim();
    const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();

    return NextResponse.json({
      version: '1.0.0',
      git: {
        hash: gitHash,
        short: gitShort,
        branch: gitBranch,
        message: gitMessage
      },
      build: {
        time: buildTime,
        env: process.env.NEXT_PUBLIC_ENV || 'development',
        nextVersion: process.env.npm_package_dependencies_next || 'unknown'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get build info',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
