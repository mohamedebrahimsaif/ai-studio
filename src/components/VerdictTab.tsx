import React from 'react';
import { 
  Trophy, 
  DoorOpen, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  Clock, 
  HelpCircle,
  Sparkles,
  GitFork,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';
import { calculateWeightedScores } from '../utils/scoring';

interface VerdictTabProps {
  analysis: DecisionAnalysis;
  onNavigateTab: (tabId: string) => void;
  onOpenCoinToss: () => void;
}

export const VerdictTab: React.FC<VerdictTabProps> = ({
  analysis,
  onNavigateTab,
  onOpenCoinToss,
}) => {
  const verdict = analysis.tiebreakerVerdict;
  const weightedScores = calculateWeightedScores(analysis);
  
  // Find recommended option
  const recommendedOpt = analysis.options.find(
    (o) => o.id === verdict.recommendedOptionId
  ) || analysis.options[0];

  const isType1 = analysis.decisionType === 'reversibility_type1';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Primary Verdict Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  The Tiebreaker Recommendation
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  verdict.confidenceLevel === 'High' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {verdict.confidenceLevel} Confidence
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {recommendedOpt?.title}
              </h2>
            </div>
          </div>

          {/* Interactive Coin Toss Button */}
          <button
            onClick={onOpenCoinToss}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-amber-500/40 text-xs font-semibold shadow-md transition-all group"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Test Your Gut (Coin Flip)</span>
          </button>
        </div>

        {/* Executive Summary */}
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 mb-6">
          {verdict.executiveSummary}
        </p>

        {/* Options Comparative Score Meters */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Weighted Matrix Score Breakdown:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.options.map((opt) => {
              const scoreData = weightedScores[opt.id] || { percentage: 50 };
              const isWinner = opt.id === recommendedOpt?.id;

              return (
                <div 
                  key={opt.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isWinner 
                      ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20' 
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {isWinner && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      {opt.title}
                    </span>
                    <span className="text-xs font-extrabold text-amber-300">
                      {scoreData.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isWinner 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-300' 
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${scoreData.percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">
                    {opt.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decision Architecture & Reversibility */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reversibility Framework */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DoorOpen className={`w-5 h-5 ${isType1 ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Decision Reversibility
              </span>
            </div>
            <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold mb-2.5 ${
              isType1 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {isType1 ? 'Type 1: One-Way Door (High Friction)' : 'Type 2: Two-Way Door (Reversible)'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {analysis.decisionTypeExplanation || (
                isType1 
                  ? 'This decision is difficult or costly to undo once enacted. Take extra time to audit blind spots and negotiate downside protections.'
                  : 'This decision can be unmade or pivoted with reasonable effort. Bias towards speed, action, and learning over prolonged analysis paralysis.'
              )}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
            Framework popularized by Jeff Bezos
          </div>
        </div>

        {/* The 10-10-10 Rule Card */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              The 10-10-10 Rule (Temporal Perspective)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                In 10 Minutes
              </span>
              <p className="text-xs text-slate-300 leading-snug">
                {verdict.tenTenTenRule?.in10Minutes || 'Initial relief from resolving uncertainty, coupled with immediate focus on execution.'}
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                In 10 Months
              </span>
              <p className="text-xs text-slate-300 leading-snug">
                {verdict.tenTenTenRule?.in10Months || 'The initial turbulence will normalize into daily routine with tangible skill or asset gains.'}
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                In 10 Years
              </span>
              <p className="text-xs text-slate-300 leading-snug">
                {verdict.tenTenTenRule?.in10Years || 'Will stand as a defining inflection point shaping your long-term confidence and trajectory.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Playbook */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <GitFork className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            The Conditional Decision Playbook
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          No two individuals share identical non-negotiables. Tailor your final pick based on your personal priorities:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {verdict.conditionalRules?.map((rule, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
            >
              <div className="text-xs text-slate-300 mb-2">
                <span className="font-semibold text-slate-100">{rule.condition}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mt-2 pt-2 border-t border-slate-800/60">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span>Choose: {rule.chosenOption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blind Spots & De-risking Action Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hidden Blind Spots */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Cognitive Biases &amp; Blind Spots Detected
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Watch out for these psychological distortions in this specific decision:
          </p>
          <div className="space-y-2.5">
            {verdict.hiddenBlindSpots?.map((spot, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <span className="text-xs font-bold text-amber-400 mt-0.5">•</span>
                <p className="text-xs text-slate-300 leading-relaxed">{spot}</p>
              </div>
            ))}
          </div>
        </div>

        {/* De-Risking Micro-Experiments */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              De-Risking Action Plan
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Micro-experiments you can execute before committing 100%:
          </p>
          <div className="space-y-2.5">
            {verdict.deRiskingActions?.map((act, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <span className="text-xs font-bold text-emerald-400 mt-0.5">{i + 1}.</span>
                <p className="text-xs text-slate-300 leading-relaxed">{act}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation Footer */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-400">
          Want to explore deeper details?
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('pros-cons')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Pros &amp; Cons List
          </button>
          <button
            onClick={() => onNavigateTab('comparison-matrix')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Comparison Matrix
          </button>
          <button
            onClick={() => onNavigateTab('swot')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            SWOT Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
