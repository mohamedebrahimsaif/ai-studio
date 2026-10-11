import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  Zap, 
  Plus, 
  Trash2,
  Layers
} from 'lucide-react';
import { DecisionAnalysis, SWOTData } from '../types/decision';

interface SWOTTabProps {
  analysis: DecisionAnalysis;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
}

export const SWOTTab: React.FC<SWOTTabProps> = ({
  analysis,
  onUpdateAnalysis,
}) => {
  const [activeOptId, setActiveOptId] = useState(analysis.options[0]?.id || '');
  const [addingQuadrant, setAddingQuadrant] = useState<keyof SWOTData | null>(null);
  const [newItemText, setNewItemText] = useState('');

  const currentOption = analysis.options.find((o) => o.id === activeOptId) || analysis.options[0];

  const handleAddItem = (quadrant: keyof SWOTData) => {
    if (!newItemText.trim() || !currentOption) return;

    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      return {
        ...opt,
        swot: {
          ...opt.swot,
          [quadrant]: [...opt.swot[quadrant], newItemText.trim()],
        },
      };
    });

    onUpdateAnalysis({
      ...analysis,
      options: updatedOptions,
    });

    setNewItemText('');
    setAddingQuadrant(null);
  };

  const handleDeleteItem = (quadrant: keyof SWOTData, index: number) => {
    if (!currentOption) return;

    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      return {
        ...opt,
        swot: {
          ...opt.swot,
          [quadrant]: opt.swot[quadrant].filter((_, i) => i !== index),
        },
      };
    });

    onUpdateAnalysis({
      ...analysis,
      options: updatedOptions,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Option Selector Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            Strategic SWOT Matrix
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Internal &amp; External Environmental Analysis
          </h3>
        </div>

        {/* Tab switchers for Options */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {analysis.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveOptId(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                opt.id === activeOptId
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {opt.title}
            </button>
          ))}
        </div>
      </div>

      {currentOption && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300">
            <span className="font-bold text-amber-300 mr-2">Target Strategy:</span>
            {currentOption.summary}
          </div>

          {/* 4 Quadrants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STRENGTHS */}
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                        Strengths
                      </h4>
                      <span className="text-[10px] text-slate-400">Internal Advantages</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setAddingQuadrant('strengths')}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {currentOption.swot.strengths.map((item, idx) => (
                    <div
                      key={idx}
                      className="group p-3 rounded-xl bg-slate-950/70 border border-emerald-950/80 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400 text-xs font-bold mt-0.5">•</span>
                        <p className="text-xs text-slate-200 leading-relaxed">{item}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteItem('strengths', idx)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* WEAKNESSES */}
            <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider">
                        Weaknesses
                      </h4>
                      <span className="text-[10px] text-slate-400">Internal Limitations</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setAddingQuadrant('weaknesses')}
                    className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {currentOption.swot.weaknesses.map((item, idx) => (
                    <div
                      key={idx}
                      className="group p-3 rounded-xl bg-slate-950/70 border border-rose-950/80 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-rose-400 text-xs font-bold mt-0.5">•</span>
                        <p className="text-xs text-slate-200 leading-relaxed">{item}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteItem('weaknesses', idx)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OPPORTUNITIES */}
            <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-sky-400 uppercase tracking-wider">
                        Opportunities
                      </h4>
                      <span className="text-[10px] text-slate-400">External Upsides &amp; Trends</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setAddingQuadrant('opportunities')}
                    className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {currentOption.swot.opportunities.map((item, idx) => (
                    <div
                      key={idx}
                      className="group p-3 rounded-xl bg-slate-950/70 border border-sky-950/80 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-sky-400 text-xs font-bold mt-0.5">•</span>
                        <p className="text-xs text-slate-200 leading-relaxed">{item}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteItem('opportunities', idx)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* THREATS */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                        Threats
                      </h4>
                      <span className="text-[10px] text-slate-400">External Risks &amp; Obstacles</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setAddingQuadrant('threats')}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {currentOption.swot.threats.map((item, idx) => (
                    <div
                      key={idx}
                      className="group p-3 rounded-xl bg-slate-950/70 border border-amber-950/80 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-amber-400 text-xs font-bold mt-0.5">•</span>
                        <p className="text-xs text-slate-200 leading-relaxed">{item}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteItem('threats', idx)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {addingQuadrant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <h4 className="text-base font-bold text-white mb-2 capitalize">
              Add {addingQuadrant} for {currentOption?.title}
            </h4>
            <div className="space-y-4">
              <textarea
                rows={3}
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Describe the factor..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddingQuadrant(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem(addingQuadrant)}
                  disabled={!newItemText.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
