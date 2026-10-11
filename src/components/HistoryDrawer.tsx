import React from 'react';
import { 
  X, 
  Trash2, 
  Calendar, 
  ArrowRight, 
  History, 
  Sparkles,
  Scale
} from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Decision History</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {savedDecisions.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {savedDecisions.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs">
                <Scale className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="font-semibold text-slate-400">No decisions saved yet.</p>
                <p className="mt-1 text-slate-500">
                  Analyze any decision dilemma and it will be saved here automatically.
                </p>
              </div>
            ) : (
              savedDecisions.map((dec) => (
                <div
                  key={dec.id}
                  className="group p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between cursor-pointer"
                  onClick={() => {
                    onSelectDecision(dec);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2">
                      {dec.title}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(dec.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(dec.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-amber-400/90 flex items-center gap-1">
                      <span>{dec.options.length} Options</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {savedDecisions.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center">
              <button
                onClick={onClearAll}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300"
              >
                Clear History
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
