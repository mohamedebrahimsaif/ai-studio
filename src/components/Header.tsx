import React from 'react';
import { Scale, History, PlusCircle, Share2, Sparkles } from 'lucide-react';
import { SAMPLE_DECISIONS } from '../data/sampleDecisions';
import { DecisionAnalysis } from '../types/decision';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
  onSelectSample: (decision: DecisionAnalysis) => void;
  hasActiveDecision: boolean;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  onOpenExport,
  onSelectSample,
  hasActiveDecision,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                The Tiebreaker
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI Matrix
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Strategic Decision Analysis &amp; Dilemma Resolution
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sample decisions dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Try Sample Dilemmas</span>
              <span className="md:hidden">Samples</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-64 p-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-150 z-50">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Load Example Dilemma
              </div>
              {SAMPLE_DECISIONS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="w-full text-left p-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex flex-col gap-0.5"
                >
                  <span className="font-medium text-amber-300 truncate w-full">
                    {sample.options.map(o => o.title).join(' vs ')}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">
                    {sample.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* History drawer trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors relative"
            title="Saved Decisions History"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* Export / Share button (if active) */}
          {hasActiveDecision && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
              title="Export or Print Decision"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {/* New Decision Button */}
          <button
            onClick={onNewDecision}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:shadow-amber-500/30"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>New Decision</span>
          </button>
        </div>
      </div>
    </header>
  );
};
