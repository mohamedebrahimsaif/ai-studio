import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  HelpCircle, 
  Trophy, 
  Info, 
  ChevronDown, 
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { DecisionAnalysis, ComparisonCriterion } from '../types/decision';
import { calculateWeightedScores } from '../utils/scoring';

interface ComparisonMatrixTabProps {
  analysis: DecisionAnalysis;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
}

export const ComparisonMatrixTab: React.FC<ComparisonMatrixTabProps> = ({
  analysis,
  onUpdateAnalysis,
}) => {
  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);
  const [showAddCriterion, setShowAddCriterion] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritDesc, setNewCritDesc] = useState('');
  const [newCritWeight, setNewCritWeight] = useState(3);

  const weightedScores = calculateWeightedScores(analysis);

  // Determine top scorer dynamically
  let topOptionId = analysis.options[0]?.id;
  let highestPct = -1;
  analysis.options.forEach((opt) => {
    const pct = weightedScores[opt.id]?.percentage ?? 0;
    if (pct > highestPct) {
      highestPct = pct;
      topOptionId = opt.id;
    }
  });

  const handleWeightChange = (critId: string, weight: number) => {
    const updatedCriteria = analysis.criteria.map((c) => {
      if (c.id !== critId) return c;
      return { ...c, importanceWeight: weight };
    });

    onUpdateAnalysis({
      ...analysis,
      criteria: updatedCriteria,
    });
  };

  const handleScoreChange = (critId: string, optionId: string, newScore: number) => {
    const updatedCriteria = analysis.criteria.map((c) => {
      if (c.id !== critId) return c;
      return {
        ...c,
        scores: {
          ...c.scores,
          [optionId]: {
            ...c.scores[optionId],
            score: newScore,
            rationale: c.scores[optionId]?.rationale || 'User adjusted score',
          },
        },
      };
    });

    onUpdateAnalysis({
      ...analysis,
      criteria: updatedCriteria,
    });
  };

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newCrit: ComparisonCriterion = {
      id: `crit_${Date.now()}`,
      name: newCritName.trim(),
      description: newCritDesc.trim() || 'Custom user criterion',
      importanceWeight: newCritWeight,
      scores: {},
    };

    analysis.options.forEach((opt) => {
      newCrit.scores[opt.id] = {
        score: 5,
        rationale: 'Baseline neutral score (adjust using selector)',
      };
    });

    onUpdateAnalysis({
      ...analysis,
      criteria: [...analysis.criteria, newCrit],
    });

    setNewCritName('');
    setNewCritDesc('');
    setShowAddCriterion(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Dynamic Live Winner Score */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Interactive Weighted Comparison Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Adjust criteria weights below to see which option wins according to your personal values.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddCriterion(!showAddCriterion)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Criterion</span>
          </button>
        </div>

        {/* Live Score Leaderboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {analysis.options.map((opt) => {
            const isLeader = opt.id === topOptionId;
            const scoreObj = weightedScores[opt.id] || { percentage: 0 };

            return (
              <div
                key={opt.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isLeader
                    ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    {isLeader && <Trophy className="w-4 h-4 text-amber-400 shrink-0" />}
                    <span className="text-xs font-bold text-white truncate">
                      {opt.title}
                    </span>
                  </div>
                  <span className={`text-sm font-extrabold ${isLeader ? 'text-amber-400' : 'text-slate-300'}`}>
                    {scoreObj.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLeader ? 'bg-gradient-to-r from-amber-500 to-amber-300' : 'bg-slate-600'
                    }`}
                    style={{ width: `${scoreObj.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Criterion Drawer */}
      {showAddCriterion && (
        <form onSubmit={handleAddCriterion} className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Add Custom Evaluation Criterion</h4>
            <button
              type="button"
              onClick={() => setShowAddCriterion(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Criterion Name</label>
              <input
                type="text"
                required
                value={newCritName}
                onChange={(e) => setNewCritName(e.target.value)}
                placeholder="e.g. Commute Time, Culture, Health..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Description / Metric</label>
              <input
                type="text"
                value={newCritDesc}
                onChange={(e) => setNewCritDesc(e.target.value)}
                placeholder="What this evaluates"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Importance Weight (1 to 5)
              </label>
              <select
                value={newCritWeight}
                onChange={(e) => setNewCritWeight(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
              >
                <option value={1}>1 - Low Priority</option>
                <option value={2}>2 - Minor</option>
                <option value={3}>3 - Moderate</option>
                <option value={4}>4 - High Priority</option>
                <option value={5}>5 - Paramount (Critical)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Add to Matrix
            </button>
          </div>
        </form>
      )}

      {/* The Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5 w-72">Criterion &amp; Importance Weight</th>
                {analysis.options.map((opt) => (
                  <th key={opt.id} className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-white">
                      <span>{opt.title}</span>
                      {opt.id === topOptionId && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          Leader
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {analysis.criteria.map((crit) => (
                <tr key={crit.id} className="hover:bg-slate-850/40 transition-colors">
                  {/* Criterion Info & Weight Slider */}
                  <td className="py-4 px-5 align-top">
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-100">
                        {crit.name}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {crit.description}
                      </p>
                      
                      {/* Weight Controller */}
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-400">Weight:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((w) => (
                            <button
                              key={w}
                              onClick={() => handleWeightChange(crit.id, w)}
                              className={`w-5 h-5 rounded text-[10px] font-bold transition-all ${
                                crit.importanceWeight === w
                                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                              title={`Set weight to ${w}x`}
                            >
                              {w}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Option Scores */}
                  {analysis.options.map((opt) => {
                    const scoreData = crit.scores[opt.id] || { score: 5, rationale: 'Not evaluated' };
                    const rationaleKey = `${crit.id}_${opt.id}`;
                    const isExpanded = expandedRationale === rationaleKey;

                    return (
                      <td key={opt.id} className="py-4 px-5 align-top">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-base font-extrabold ${
                                scoreData.score >= 8 
                                  ? 'text-emerald-400' 
                                  : scoreData.score >= 5 
                                  ? 'text-amber-400' 
                                  : 'text-rose-400'
                              }`}>
                                {scoreData.score}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">/10</span>
                            </div>

                            {/* Editable score dropdown */}
                            <select
                              value={scoreData.score}
                              onChange={(e) => handleScoreChange(crit.id, opt.id, Number(e.target.value))}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none"
                              title="Adjust score"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                                <option key={s} value={s}>
                                  Score: {s}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Visual progress bar */}
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                scoreData.score >= 8
                                  ? 'bg-emerald-400'
                                  : scoreData.score >= 5
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                              }`}
                              style={{ width: `${scoreData.score * 10}%` }}
                            />
                          </div>

                          {/* Rationale description */}
                          <div className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                            {scoreData.rationale}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
