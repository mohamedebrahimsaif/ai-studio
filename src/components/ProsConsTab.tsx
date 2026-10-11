import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Filter, 
  Tag, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { DecisionAnalysis, DecisionOption, DecisionFactor, CategoryType } from '../types/decision';
import { getProsConsNetScore } from '../utils/scoring';

interface ProsConsTabProps {
  analysis: DecisionAnalysis;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
}

const CATEGORIES: CategoryType[] = [
  'Financial',
  'Career/Growth',
  'Wellbeing',
  'Time/Effort',
  'Risk',
  'Relationships',
  'Other'
];

export const ProsConsTab: React.FC<ProsConsTabProps> = ({
  analysis,
  onUpdateAnalysis,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addingTo, setAddingTo] = useState<{ optionId: string; type: 'pro' | 'con' } | null>(null);
  const [newText, setNewText] = useState('');
  const [newImpact, setNewImpact] = useState<'high' | 'medium' | 'low'>('medium');
  const [newCategory, setNewCategory] = useState<CategoryType>('Wellbeing');

  const handleAddItem = (optionId: string, type: 'pro' | 'con') => {
    if (!newText.trim()) return;

    const newItem: DecisionFactor = {
      id: `custom_${Date.now()}`,
      text: newText.trim(),
      impact: newImpact,
      category: newCategory,
      weight: newImpact === 'high' ? 5 : newImpact === 'medium' ? 3 : 1,
    };

    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        pros: type === 'pro' ? [...opt.pros, newItem] : opt.pros,
        cons: type === 'con' ? [...opt.cons, newItem] : opt.cons,
      };
    });

    onUpdateAnalysis({
      ...analysis,
      options: updatedOptions,
    });

    setNewText('');
    setAddingTo(null);
  };

  const handleDeleteItem = (optionId: string, itemId: string, type: 'pro' | 'con') => {
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        pros: type === 'pro' ? opt.pros.filter((p) => p.id !== itemId) : opt.pros,
        cons: type === 'con' ? opt.cons.filter((c) => c.id !== itemId) : opt.cons,
      };
    });

    onUpdateAnalysis({
      ...analysis,
      options: updatedOptions,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Category filter pills */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Filter Factors:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side or stacked options comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analysis.options.map((option, optIdx) => {
          const netScore = getProsConsNetScore(option.pros, option.cons);
          const filteredPros = option.pros.filter(
            (p) => selectedCategory === 'All' || p.category === selectedCategory
          );
          const filteredCons = option.cons.filter(
            (c) => selectedCategory === 'All' || c.category === selectedCategory
          );

          return (
            <div
              key={option.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Option {String.fromCharCode(65 + optIdx)}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {option.title}
                    </h3>
                  </div>
                  {/* Net Score Pill */}
                  <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    netScore > 0 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : netScore < 0
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {netScore > 0 ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    <span>Net Score: {netScore > 0 ? `+${netScore}` : netScore}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-6 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  {option.summary}
                </p>

                {/* Pros Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Advantages &amp; Pros ({filteredPros.length})
                      </span>
                    </div>
                    <button
                      onClick={() => setAddingTo({ optionId: option.id, type: 'pro' })}
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Pro
                    </button>
                  </div>

                  <div className="space-y-2">
                    {filteredPros.length === 0 ? (
                      <div className="text-xs text-slate-500 italic p-3 bg-slate-950/40 rounded-xl text-center">
                        No pros in this category.
                      </div>
                    ) : (
                      filteredPros.map((pro) => (
                        <div
                          key={pro.id}
                          className="group p-3 rounded-xl bg-slate-950/70 border border-emerald-950/60 hover:border-emerald-800/80 transition-colors flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1.5 flex-1">
                            <p className="text-xs font-medium text-slate-200 leading-relaxed">
                              {pro.text}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                {pro.category}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                pro.impact === 'high'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : pro.impact === 'medium'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                {pro.impact.toUpperCase()} IMPACT
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteItem(option.id, pro.id, 'pro')}
                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Cons Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                        Risks, Drawbacks &amp; Cons ({filteredCons.length})
                      </span>
                    </div>
                    <button
                      onClick={() => setAddingTo({ optionId: option.id, type: 'con' })}
                      className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Con
                    </button>
                  </div>

                  <div className="space-y-2">
                    {filteredCons.length === 0 ? (
                      <div className="text-xs text-slate-500 italic p-3 bg-slate-950/40 rounded-xl text-center">
                        No cons in this category.
                      </div>
                    ) : (
                      filteredCons.map((con) => (
                        <div
                          key={con.id}
                          className="group p-3 rounded-xl bg-slate-950/70 border border-rose-950/60 hover:border-rose-800/80 transition-colors flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1.5 flex-1">
                            <p className="text-xs font-medium text-slate-200 leading-relaxed">
                              {con.text}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                {con.category}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                con.impact === 'high'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : con.impact === 'medium'
                                  ? 'bg-rose-500/10 text-rose-400'
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                {con.impact.toUpperCase()} IMPACT
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteItem(option.id, con.id, 'con')}
                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {addingTo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <h4 className="text-base font-bold text-white mb-3">
              Add {addingTo.type === 'pro' ? 'Advantage (Pro)' : 'Drawback (Con)'}
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Factor Description:
                </label>
                <textarea
                  rows={2}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. Higher commute time cuts into morning workout routine..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Impact Level:
                  </label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="high">High Impact</option>
                    <option value="medium">Medium Impact</option>
                    <option value="low">Low Impact</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddingTo(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem(addingTo.optionId, addingTo.type)}
                  disabled={!newText.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50"
                >
                  Save Factor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
