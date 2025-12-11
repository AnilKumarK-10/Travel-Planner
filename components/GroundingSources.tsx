import React from 'react';
import { MapPin, Globe } from 'lucide-react';
import { GroundingChunk } from '../types';

interface GroundingSourcesProps {
  chunks?: GroundingChunk[];
}

export const GroundingSources: React.FC<GroundingSourcesProps> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;

  const webSources = chunks.filter(c => c.web);
  const mapSources = chunks.filter(c => c.maps);

  if (webSources.length === 0 && mapSources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-3">
      {mapSources.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {mapSources.map((source, idx) => (
            <a
              key={idx}
              href={source.maps?.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors group border border-transparent dark:border-indigo-900/50"
            >
              <div className="mt-0.5 w-6 h-6 rounded-full bg-white dark:bg-indigo-900 flex items-center justify-center shadow-sm text-indigo-600 dark:text-indigo-400 shrink-0">
                <MapPin size={14} />
              </div>
              <div className="ml-2 overflow-hidden">
                <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 truncate">{source.maps?.title}</p>
                <p className="text-[10px] text-indigo-700 dark:text-indigo-400">View on Maps</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {webSources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {webSources.map((source, idx) => (
            <a
              key={idx}
              href={source.web?.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 max-w-full"
            >
              <Globe size={10} className="mr-1.5 shrink-0" />
              <span className="truncate max-w-[150px]">{source.web?.title}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};