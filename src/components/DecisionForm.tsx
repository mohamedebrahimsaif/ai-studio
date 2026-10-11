import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Zap, 
  Clock, 
  ShieldAlert,
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DecisionFormProps {
  onSubmit: (formData: {
    decision: string;
    context: string;
    options: string[];
    customCriteria: string[];
    urgency: 'urgent' | 'moderate' | 'exploratory';
  }) => void;
  isLoading: boolean;
}

const PRESET_IDEAS = [
  {
    title: 'Career Leap',
    dilemma: 'Should I leave my secure corporate tech lead role to co-found a seed-stage venture?',
    context: 'Have 9 months personal runway. Current job pays $200k with low stress but slow trajectory.',
  },
  {
    title: 'Buy vs Rent',
    dilemma: 'Should I purchase a 3-bedroom home with today’s mortgage rates or continue renting and investing?',
    context: 'Down payment ready, but mortgage payments would be 40% higher than rent.',
  },
  {
    title: 'Tech Architecture',
    dilemma: 'Should our engineering team refactor our legacy monolith or migrate to microservices / serverless?',
    context: 'Team of 12 engineers. Deployments currently take 45 minutes; tech debt is mounting.',
  },
  {
    title: 'Life Relocation',
    dilemma: 'Should I relocate to London for international career exposure or stay in my home city near family?',
    context: 'Mid-20s, single, partner willing to move, close relationship with aging parents.',
  },
];

const LOADING_STEPS = [
  'Deconstructing dilemma & framing alternatives...',
  'Compiling categorized Pros & Cons with weighted impact...',
  'Generating multi-criteria comparison matrix & scoring...',
  'Mapping 4-quadrant SWOT for each strategic path...',
  'Auditing cognitive biases & calculating Tiebreaker Verdict...',
];

export const DecisionForm: React.FC<DecisionFormProps> = ({ onSubmit, isLoading }) => {
  const [decision, setDecision] = useState('');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [criteria, setCriteria] = useState<string[]>([]);
  const [criteriaInput, setCriteriaInput] = useState('');
  const [urgency, setUrgency] = useState<'urgent' | 'moderate' | 'exploratory'>('moderate');
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleAddCriterion = () => {
    if (criteriaInput.trim() && !criteria.includes(criteriaInput.trim())) {
      setCriteria([...criteria, criteriaInput.trim()]);
      setCriteriaInput('');
    }
  };

  const handleRemoveCriterion = (item: string) => {
    setCriteria(criteria.filter((c) => c !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    onSubmit({
      decision: decision.trim(),
      context: context.trim(),
      options: options.map((o) => o.trim()).filter(Boolean),
      customCriteria: criteria,
      urgency,
    });
  };

  const applyPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setDecision(preset.dilemma);
    setContext(preset.context);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Intro hero badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Multi-Perspective AI Decision Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
          Stop Overthinking. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
            Let's Break The Tie.
          </span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Input any tough personal, career, financial, or strategic dilemma. Get a rigorous breakdown: 
          <strong> Pros &amp; Cons</strong>, <strong>Weighted Comparison Matrix</strong>, <strong>SWOT Analysis</strong>, and an actionable <strong>Tiebreaker Verdict</strong>.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {isLoading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
                <Compass className="w-10 h-10 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold shadow-lg">
                AI
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Dilemma</h3>
            <p className="text-sm text-amber-300/90 font-medium mb-6 animate-fade-in">
              {LOADING_STEPS[loadingStepIdx]}
            </p>

            <div className="w-full max-w-md bg-slate-800 rounded-full h-2 overflow-hidden mb-6">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-700 ease-out"
                style={{ width: `${((loadingStepIdx + 1) / LOADING_STEPS.length) * 100}%` }}
              />
            </div>

            <div className="flex flex-col gap-2 max-w-sm text-left">
              {LOADING_STEPS.map((step, idx) => (
                <div 
                  key={step} 
                  className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
                    idx <= loadingStepIdx ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${
                    idx <= loadingStepIdx ? 'text-amber-400' : 'text-slate-700'
                  }`} />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dilemma Textarea */}
            <div>
              <label htmlFor="decision-input" className="block text-sm font-semibold text-slate-200 mb-2">
                What decision do you need to make? <span className="text-amber-400">*</span>
              </label>
              <textarea
                id="decision-input"
                rows={3}
                required
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="e.g. Should I accept the remote job offer at a Series-B startup, or stay at my stable corporate engineering role?"
                className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm sm:text-base resize-y"
              />
            </div>

            {/* Quick Inspiration Presets */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Or select a quick scenario to test:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_IDEAS.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-colors text-left"
                  >
                    <span className="font-semibold text-amber-300/90 mr-1.5">{preset.title}:</span>
                    <span className="text-slate-400 line-clamp-1">{preset.dilemma}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Context / Constraints */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="context-input" className="text-sm font-semibold text-slate-200">
                  Additional Context, Numbers &amp; Constraints <span className="text-xs font-normal text-slate-400">(Optional but helps AI be precise)</span>
                </label>
              </div>
              <textarea
                id="context-input"
                rows={2}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Salary difference is $30k; I have 2 children; current work commute is 15 min; my partner works remotely; risk tolerance is medium..."
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm resize-y"
              />
            </div>

            {/* Advanced Options Accordion */}
            <div className="border border-slate-800 rounded-xl bg-slate-950/40 p-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Customize Specific Options &amp; Priorities (Optional)</span>
                </div>
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-5 pt-3 border-t border-slate-800/80">
                  {/* Named Options */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300">
                        Define Specific Options (AI will automatically formulate if left blank):
                      </span>
                      {options.length < 5 && (
                        <button
                          type="button"
                          onClick={handleAddOption}
                          className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                        >
                          <Plus className="w-3 h-3" />
                          Add Option
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 w-16">
                            Option {String.fromCharCode(65 + idx)}:
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            placeholder={`e.g. ${idx === 0 ? 'Accept the new role' : 'Stay in current position'}`}
                            className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                          />
                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(idx)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Priorities / Criteria */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Specific Criteria or Non-Negotiables:
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={criteriaInput}
                        onChange={(e) => setCriteriaInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCriterion();
                          }
                        }}
                        placeholder="e.g. Work-Life Balance, Financial Upside, Autonomy..."
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCriterion}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700"
                      >
                        Add
                      </button>
                    </div>
                    {criteria.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {criteria.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-800 text-slate-200 border border-slate-700"
                          >
                            <span>{c}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCriterion(c)}
                              className="text-slate-400 hover:text-rose-400"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Decision Horizon &amp; Urgency:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'urgent', label: 'Urgent (< 48 hrs)', icon: Zap },
                        { id: 'moderate', label: 'Balanced (1-2 wks)', icon: Clock },
                        { id: 'exploratory', label: 'Long-term (Months)', icon: Compass },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = urgency === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setUrgency(item.id as any)}
                            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-850'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!decision.trim() || isLoading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all flex items-center justify-center gap-2 group text-base"
              >
                <span>Break The Tie &amp; Analyze</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-xs text-slate-400 mt-2.5">
                Generates Pros &amp; Cons, Comparison Table, SWOT Matrix, and Cognitive Bias Check.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
