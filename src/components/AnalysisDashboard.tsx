import React, { useState } from 'react';
import { 
  Trophy, 
  ListFilter, 
  Sliders, 
  Layers, 
  Brain, 
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  ChevronRight
} from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';
import { VerdictTab } from './VerdictTab';
import { ProsConsTab } from './ProsConsTab';
import { ComparisonMatrixTab } from './ComparisonMatrixTab';
import { SWOTTab } from './SWOTTab';
import { GutCheckTab } from './GutCheckTab';
import { DeepDiveChat } from './DeepDiveChat';

interface AnalysisDashboardProps {
  analysis: DecisionAnalysis;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
  onBackToNew: () => void;
  onOpenExport: () => void;
}

type TabType = 'verdict' | 'pros-cons' | 'comparison-matrix' | 'swot' | 'gut-check' | 'deep-dive';

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  onUpdateAnalysis,
  onBackToNew,
  onOpenExport,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('verdict');

  const tabs: Array<{ id: TabType; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'verdict', label: 'The Tiebreaker Verdict', icon: Trophy, badge: 'Winner' },
    { id: 'pros-cons', label: 'Pros & Cons List', icon: ListFilter },
    { id: 'comparison-matrix', label: 'Comparison Matrix', icon: Sliders, badge: 'Interactive' },
    { id: 'swot', label: 'SWOT Analysis', icon: Layers },
    { id: 'gut-check', label: 'Gut Check (Coin Flip)', icon: Brain },
    { id: 'deep-dive', label: 'Ask "What If?"', icon: MessageSquare },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Metadata Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl backdrop-blur-md">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToNew}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dilemma Input</span>
            </button>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              {new Date(analysis.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            {analysis.title}
          </h1>
          {analysis.context && (
            <p className="text-xs text-slate-400 line-clamp-2 max-w-4xl">
              <strong>Context:</strong> {analysis.context}
            </p>
          )}
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Export / Share</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab View */}
      <main className="min-h-[500px]">
        {activeTab === 'verdict' && (
          <VerdictTab
            analysis={analysis}
            onNavigateTab={(tabId) => setActiveTab(tabId as TabType)}
            onOpenCoinToss={() => setActiveTab('gut-check')}
          />
        )}

        {activeTab === 'pros-cons' && (
          <ProsConsTab
            analysis={analysis}
            onUpdateAnalysis={onUpdateAnalysis}
          />
        )}

        {activeTab === 'comparison-matrix' && (
          <ComparisonMatrixTab
            analysis={analysis}
            onUpdateAnalysis={onUpdateAnalysis}
          />
        )}

        {activeTab === 'swot' && (
          <SWOTTab
            analysis={analysis}
            onUpdateAnalysis={onUpdateAnalysis}
          />
        )}

        {activeTab === 'gut-check' && (
          <GutCheckTab
            analysis={analysis}
          />
        )}

        {activeTab === 'deep-dive' && (
          <DeepDiveChat
            analysis={analysis}
          />
        )}
      </main>
    </div>
  );
};
