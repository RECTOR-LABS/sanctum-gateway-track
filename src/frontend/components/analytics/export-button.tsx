'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileJson, Image } from 'lucide-react';
import {
  downloadCSV,
  downloadJSON,
  exportChartAsPNG,
  generateFilename,
  type ExportFormat,
} from '@/lib/export';

interface ExportButtonProps {
  data: any[];
  filename: string;
  formats?: ExportFormat[];
  headers?: string[];
  onExport?: (format: ExportFormat) => void;
  chartElementId?: string;
  className?: string;
}

export function ExportButton({
  data,
  filename,
  formats = ['csv', 'json'],
  headers,
  onExport,
  chartElementId,
  className,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setShowMenu(false);

    try {
      const exportFilename = generateFilename(filename);

      if (format === 'csv') {
        downloadCSV(data, exportFilename, headers);
      } else if (format === 'json') {
        downloadJSON(data, exportFilename);
      }

      onExport?.(format);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportChart = async () => {
    if (!chartElementId) return;

    setIsExporting(true);
    setShowMenu(false);

    try {
      const exportFilename = generateFilename(filename);
      await exportChartAsPNG(chartElementId, exportFilename);
      onExport?.('csv'); // Just for callback
    } catch (error) {
      console.error('Chart export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Single format - direct export button
  if (formats.length === 1 && !chartElementId) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport(formats[0])}
        disabled={isExporting || !data || data.length === 0}
        className={className}
      >
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? 'Exporting...' : `Export ${formats[0].toUpperCase()}`}
      </Button>
    );
  }

  // Multiple formats - dropdown menu
  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting || !data || data.length === 0}
        className={className}
      >
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-card shadow-lg z-20">
            <div className="p-2 space-y-1">
              {formats.includes('csv') && (
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </button>
              )}
              {formats.includes('json') && (
                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                >
                  <FileJson className="h-4 w-4" />
                  Export as JSON
                </button>
              )}
              {chartElementId && (
                <button
                  onClick={handleExportChart}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                >
                  <Image className="h-4 w-4" />
                  Export Chart as PNG
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
