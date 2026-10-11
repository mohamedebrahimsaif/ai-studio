import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Share2, 
  FileText 
} from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';

interface ExportModalProps {
  analysis: DecisionAnalysis;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ analysis, onClose }) => {
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    const lines: string[] = [];
    lines.push(`# The Tiebreaker - Decision Analysis`);
    lines.push(`**Dilemma:** ${analysis.title}\n`);
    if (analysis.context) lines.push(`**Context:** ${analysis.context}\n`);
    lines.push(`**Date:** ${new Date(analysis.createdAt).toLocaleDateString()}\n`);
    lines.push(`---\n`);

    lines.push(`## 🏆 The Tiebreaker Verdict`);
    lines.push(`${analysis.tiebreakerVerdict.executiveSummary}\n`);
    lines.push(`**Confidence:** ${analysis.tiebreakerVerdict.confidenceLevel}`);
    lines.push(`**Decision Type:** ${analysis.decisionType === 'reversibility_type1' ? 'Type 1 (One-Way Door)' : 'Type 2 (Two-Way Door)'}\n`);

    lines.push(`### Conditional Rules:`);
    analysis.tiebreakerVerdict.conditionalRules?.forEach((rule) => {
      lines.push(`- ${rule.condition} -> **${rule.chosenOption}**`);
    });
    lines.push('');

    lines.push(`---\n`);
    lines.push(`## ⚖️ Options & Pros/Cons`);
    analysis.options.forEach((opt) => {
      lines.push(`### ${opt.title}`);
      lines.push(`_${opt.summary}_\n`);
      lines.push(`**Pros:**`);
      opt.pros.forEach((p) => lines.push(`- [${p.category}] ${p.text} (${p.impact} impact)`));
      lines.push(`\n**Cons:**`);
      opt.cons.forEach((c) => lines.push(`- [${c.category}] ${c.text} (${c.impact} impact)`));
      lines.push('');
    });

    lines.push(`---\n`);
    lines.push(`## 📊 Comparison Matrix`);
    analysis.criteria.forEach((crit) => {
      lines.push(`### ${crit.name} (Weight: ${crit.importanceWeight}x)`);
      lines.push(`${crit.description}`);
      analysis.options.forEach((opt) => {
        const score = crit.scores[opt.id];
        lines.push(`- **${opt.title}:** ${score?.score || '-'}/10 - ${score?.rationale || ''}`);
      });
      lines.push('');
    });

    lines.push(`---\n`);
    lines.push(`## 🧭 SWOT Analysis`);
    analysis.options.forEach((opt) => {
      lines.push(`### ${opt.title} SWOT`);
      lines.push(`- **Strengths:** ${opt.swot.strengths.join(', ')}`);
      lines.push(`- **Weaknesses:** ${opt.swot.weaknesses.join(', ')}`);
      lines.push(`- **Opportunities:** ${opt.swot.opportunities.join(', ')}`);
      lines.push(`- **Threats:** ${opt.swot.threats.join(', ')}`);
      lines.push('');
    });

    return lines.join('\n');
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tiebreaker_${analysis.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Export &amp; Share Decision</h3>
            <p className="text-xs text-slate-400">Save summary to document, clipboard, or print</p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'Copied Markdown!' : 'Copy as Markdown'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print / PDF View</span>
          </button>
        </div>

        {/* Preview of text */}
        <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 max-h-72 overflow-y-auto text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
          {generateMarkdown()}
        </div>

        <div className="flex justify-end pt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
