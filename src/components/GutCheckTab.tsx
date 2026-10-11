import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Heart, 
  Brain, 
  Eye, 
  CheckSquare, 
  Square,
  ShieldCheck
} from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';

interface GutCheckTabProps {
  analysis: DecisionAnalysis;
}

export const GutCheckTab: React.FC<GutCheckTabProps> = ({ analysis }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [hasFlippedOnce, setHasFlippedOnce] = useState(false);
  const [checkedBiases, setCheckedBiases] = useState<Record<number, boolean>>({});

  const optionA = analysis.options[0]?.title || 'Option A';
  const optionB = analysis.options[1]?.title || 'Option B';

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    // Randomize result after spin
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      setIsFlipping(false);
      setHasFlippedOnce(true);
    }, 1800);
  };

  const toggleBiasCheck = (index: number) => {
    setCheckedBiases((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const landedOption = result === 'heads' ? optionA : optionB;
  const alternateOption = result === 'heads' ? optionB : optionA;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Intro Philosophy Box */}
      <div className="bg-gradient-to-r from-slate-900 to-amber-950/20 border border-amber-500/30 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              The Inverted Coin Flip Test
            </h3>
            <p className="text-xs text-slate-300">
              When logic is tied, your subconscious emotional reaction breaks the deadlock.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mt-2">
          "When you can't decide between two paths, flip a coin. Not because the coin decides for you, but because in the three seconds while it's in the air, you suddenly discover what you are hoping it lands on."
        </p>
      </div>

      {/* Interactive Coin Flipper */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Mapping info */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 mb-8 w-full max-w-md">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex-1 text-center">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              HEADS
            </span>
            <span className="text-xs font-bold text-white mt-1 line-clamp-1">
              {optionA}
            </span>
          </div>

          <div className="text-slate-600 font-extrabold text-sm">VS</div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex-1 text-center">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              TAILS
            </span>
            <span className="text-xs font-bold text-white mt-1 line-clamp-1">
              {optionB}
            </span>
          </div>
        </div>

        {/* The 3D-styled Coin */}
        <div className="relative my-4 cursor-pointer select-none" onClick={handleFlip}>
          <div
            className={`w-36 h-36 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border-4 border-amber-300/80 shadow-2xl shadow-amber-500/30 flex items-center justify-center text-slate-950 font-black text-2xl tracking-widest transition-transform duration-700 ${
              isFlipping ? 'animate-spin scale-110' : 'hover:scale-105'
            }`}
            style={{
              boxShadow: 'inset 0 0 16px rgba(0,0,0,0.3), 0 10px 25px -5px rgba(245, 158, 11, 0.4)',
            }}
          >
            {isFlipping ? (
              <span className="text-xl">???</span>
            ) : result ? (
              <div className="flex flex-col items-center">
                <span className="text-2xl tracking-wider">{result.toUpperCase()}</span>
                <span className="text-[10px] tracking-normal font-bold opacity-80">
                  {result === 'heads' ? 'SIDE A' : 'SIDE B'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Sparkles className="w-8 h-8 mb-1" />
                <span className="text-xs font-extrabold uppercase tracking-wider">FLIP ME</span>
              </div>
            )}
          </div>
        </div>

        {/* Flip action button */}
        <button
          onClick={handleFlip}
          disabled={isFlipping}
          className="mt-6 px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`} />
          <span>{isFlipping ? 'Coin in Flight...' : hasFlippedOnce ? 'Flip Again' : 'Toss the Tiebreaker Coin'}</span>
        </button>

        {/* Psychological Result Reveal */}
        {result && (
          <div className="mt-8 p-6 bg-slate-950/80 border border-amber-500/40 rounded-2xl max-w-xl text-left animate-scale-in">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Subconscious Gut Audit
              </span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              The coin landed on: <span className="text-amber-300">{landedOption}</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>Audit your physical sensation right now:</strong> When you saw that the coin chose <em>"{landedOption}"</em>, did you experience:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
                  <span className="font-bold text-emerald-300 block mb-1">A) Subtle Relief</span>
                  <p className="text-[11px] text-slate-300">
                    If your shoulders dropped and you felt satisfied, your intuition aligns with <strong>{landedOption}</strong>.
                  </p>
                </div>
                <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl">
                  <span className="font-bold text-rose-300 block mb-1">B) A Pang of Regret</span>
                  <p className="text-[11px] text-slate-300">
                    If your stomach tightened or you wanted a "best 2 out of 3", your real desire is <strong>{alternateOption}</strong>!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cognitive Biases Audit Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <Eye className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            Cognitive Biases Self-Audit Checklist
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Review these common traps before finalizing your decision. Check off each bias once you have honestly audited it:
        </p>

        <div className="space-y-3">
          {[
            {
              title: 'Status Quo Bias',
              desc: 'Are you leaning toward not making a change simply because the familiar feels safer than the unknown? Remember: staying put is also an active choice with compounding consequences.',
            },
            {
              title: 'Sunk Cost Fallacy',
              desc: 'Are you holding onto an option because of time, money, or emotional effort already invested? Those past resources are gone regardless—evaluate strictly on future expected value.',
            },
            {
              title: 'Loss Aversion (2:1 Pain Ratio)',
              desc: 'Humans feel the pain of losing $100 twice as acutely as the joy of gaining $100. Are you letting minor fear of failure overshadow a massive upside?',
            },
            {
              title: 'Optimistic Forecasting / Planning Fallacy',
              desc: 'Are you assuming everything will go smoothly in the new scenario while assuming current frustrations will never improve? Ground your expectations in realistic buffers.',
            },
          ].map((bias, i) => {
            const isChecked = !!checkedBiases[i];
            return (
              <div
                key={bias.title}
                onClick={() => toggleBiasCheck(i)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button type="button" className="mt-0.5 text-slate-400">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600" />
                  )}
                </button>
                <div className="flex-1">
                  <span className={`text-xs font-bold block ${isChecked ? 'text-emerald-300 line-through' : 'text-slate-200'}`}>
                    {bias.title}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    {bias.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
