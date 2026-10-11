import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { DecisionAnalysis, DeepDiveMessage } from '../types/decision';

interface DeepDiveChatProps {
  analysis: DecisionAnalysis;
}

const PRESET_QUESTIONS = [
  'What if my compensation or budget is 20% different?',
  'How can I negotiate to remove the biggest drawback of the recommended option?',
  'What critical questions should I ask before formally deciding?',
  'How should I communicate this decision to stakeholders or family?',
];

export const DeepDiveChat: React.FC<DeepDiveChatProps> = ({ analysis }) => {
  const [messages, setMessages] = useState<DeepDiveMessage[]>([
    {
      role: 'assistant',
      content: `I have analyzed "${analysis.title}". Ask me any "What If?" scenario, negotiation strategy, or risk mitigation question regarding your options.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const question = textToSend || input;
    if (!question.trim() || isLoading) return;

    const userMsg: DeepDiveMessage = {
      role: 'user',
      content: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionData: analysis,
          userQuestion: userMsg.content,
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get consultation response');
      }

      const data = await response.json();

      const aiMsg: DeepDiveMessage = {
        role: 'assistant',
        content: data.answer || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue analyzing this scenario. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Decision Consultant: "What If?" Lab</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              Interactive
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Simulate parameter shifts, edge cases, or negotiation leverage in real time.
          </p>
        </div>
      </div>

      {/* Preset quick pills */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Quick exploration prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors disabled:opacity-50 text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-line'
              }`}
            >
              <div className="markdown-content">{msg.content}</div>
              <span
                className={`text-[10px] block mt-1.5 text-right ${
                  msg.role === 'user' ? 'text-slate-900/70' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-400 animate-pulse pl-10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyzing tactical scenario...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a 'What If?' scenario or risk mitigation question..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl disabled:opacity-50 flex items-center gap-1.5 transition-colors"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
