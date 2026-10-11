import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ExportModal } from './components/ExportModal';
import { DecisionAnalysis } from './types/decision';
import { SAMPLE_DECISIONS } from './data/sampleDecisions';
import { AlertCircle, X, Sparkles, Scale } from 'lucide-react';

const STORAGE_KEY = 'tiebreaker_saved_decisions_v1';

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<DecisionAnalysis | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Load saved decisions from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedDecisions(parsed);
        }
      } else {
        // Pre-populate with sample decision in history for convenient testing
        setSavedDecisions(SAMPLE_DECISIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DECISIONS));
      }
    } catch (e) {
      console.error('Failed to parse saved decisions:', e);
    }
  }, []);

  // Save changes to localStorage
  const saveToStorage = (items: DecisionAnalysis[]) => {
    setSavedDecisions(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const handleAnalyzeDecision = async (formData: {
    decision: string;
    context: string;
    options: string[];
    customCriteria: string[];
    urgency: 'urgent' | 'moderate' | 'exploratory';
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned ${res.status}: ${res.statusText}`);
      }

      const analysisResult: DecisionAnalysis = await res.json();
      setCurrentAnalysis(analysisResult);

      // Append to saved history
      const updated = [analysisResult, ...savedDecisions.filter((d) => d.id !== analysisResult.id)];
      saveToStorage(updated);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage(
        err.message || 'Unable to generate analysis. Please verify your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAnalysis = (updated: DecisionAnalysis) => {
    setCurrentAnalysis(updated);
    const updatedList = savedDecisions.map((d) => (d.id === updated.id ? updated : d));
    saveToStorage(updatedList);
  };

  const handleSelectDecision = (decision: DecisionAnalysis) => {
    setCurrentAnalysis(decision);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDecision = (id: string) => {
    const updated = savedDecisions.filter((d) => d.id !== id);
    saveToStorage(updated);
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
  };

  const handleClearAllHistory = () => {
    saveToStorage([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans antialiased">
      {/* Top Navigation */}
      <Header
        onNewDecision={() => {
          setCurrentAnalysis(null);
          setErrorMessage(null);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onSelectSample={handleSelectDecision}
        hasActiveDecision={Boolean(currentAnalysis)}
        savedCount={savedDecisions.length}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Analysis Notice:</span>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        {currentAnalysis ? (
          <AnalysisDashboard
            analysis={currentAnalysis}
            onUpdateAnalysis={handleUpdateAnalysis}
            onBackToNew={() => setCurrentAnalysis(null)}
            onOpenExport={() => setIsExportOpen(true)}
          />
        ) : (
          <DecisionForm
            onSubmit={handleAnalyzeDecision}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Scale className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-300">The Tiebreaker</span>
            <span>— Precision AI Decision Studio</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Synthesizing Pros &amp; Cons, Comparison Matrices, SWOT Models &amp; Cognitive Biases.
          </p>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectDecision}
        onDeleteDecision={handleDeleteDecision}
        onClearAll={handleClearAllHistory}
      />

      {/* Export Modal */}
      {isExportOpen && currentAnalysis && (
        <ExportModal
          analysis={currentAnalysis}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
