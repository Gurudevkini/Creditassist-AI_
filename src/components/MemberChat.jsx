import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, CheckCircle2, ChevronDown, ChevronRight, Mic } from 'lucide-react';

const PROCESSING_STEPS = [
  "Tokenizing member query...",
  "Running intent classification model...",
  "Performing semantic vector search...",
  "Analyzing policy documents...",
  "Generating response...",
];

function formatTimestamp(date) {
  return 'Today, ' + new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function TypingIndicator() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % PROCESSING_STEPS.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="flex-shrink-0 mt-1">
        <span className="relative flex h-2.5 w-2.5 mt-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
      </div>
      <div
        className="flex-1 max-w-lg rounded-2xl rounded-tl-sm p-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderLeft: '2px solid #10b981',
        }}
      >
        <div className="shimmer-bar h-3 rounded-full mb-3" style={{ width: '70%' }} />
        <div className="shimmer-bar h-2 rounded-full mb-2" style={{ width: '50%' }} />
        <p
          className="text-xs font-mono mt-3 transition-all duration-300"
          style={{ color: 'var(--text-muted)' }}
        >
          ● {PROCESSING_STEPS[stepIdx]}
        </p>
      </div>
    </div>
  );
}

function AIMessage({ message, isOpen, onToggle }) {
  const { aiResult, content, timestamp } = message;
  const isEscalated = aiResult?.status === 'escalated';
  const borderColor = isEscalated ? '#ef4444' : '#10b981';
  const secs = aiResult ? (aiResult.processingMs / 1000).toFixed(1) : '1.2';

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="flex-shrink-0 mt-1">
        <span
          className="flex h-2.5 w-2.5 mt-1 rounded-full"
          style={{ background: isEscalated ? '#ef4444' : '#10b981' }}
        />
      </div>
      <div className="flex-1 max-w-lg">
        <div
          className="rounded-2xl rounded-tl-sm p-4 relative"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: `2px solid ${borderColor}`,
          }}
        >
          {/* Confidence badge */}
          {aiResult && (
            <span
              className="absolute top-3 right-3 text-xs font-mono px-2 py-0.5 rounded-full"
              style={
                isEscalated
                  ? { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }
                  : { background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }
              }
            >
              {isEscalated ? `⚠ ${aiResult.confidence} confidence` : `⬡ ${aiResult.confidence} confidence`}
            </span>
          )}

          {/* Response text */}
          <p className="text-sm pr-28 mb-3 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {content}
          </p>

          {/* Article ref */}
          {!isEscalated && aiResult?.articleRef && (
            <p className="text-xs font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
              📎 {aiResult.articleRef}
            </p>
          )}

          {/* Escalation card */}
          {isEscalated && aiResult?.escalationSummary && (
            <div
              className="rounded-xl p-3 mb-3 text-xs font-mono space-y-1.5"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              <div className="text-red-400 font-semibold mb-2">🚨 Case Escalated</div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Risk Score</span>
                <span className="text-red-400 font-bold">{aiResult.escalationSummary.riskScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Priority</span>
                <span style={{ color: '#f0f6fc' }}>{aiResult.escalationSummary.priority}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Action</span>
                <span style={{ color: '#f0f6fc' }}>{aiResult.escalationSummary.suggestedAction}</span>
              </div>
              {aiResult.caseId && (
                <div className="pt-1 border-t mt-1" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Your Case ID: </span>
                  <span className="text-red-300 font-semibold">{aiResult.caseId}</span>
                </div>
              )}
            </div>
          )}

          {/* Reasoning chain accordion */}
          {aiResult?.steps && (
            <div>
              <button
                onClick={onToggle}
                className="flex items-center gap-1.5 text-xs font-mono transition-colors hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}
              >
                {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                View reasoning chain ({secs}s)
              </button>
              {isOpen && (
                <div className="mt-2 space-y-1.5 animate-fade-in">
                  {aiResult.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {idx === aiResult.steps.length - 1 ? (
                        <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0 mt-1" />
                      )}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-xs font-mono mt-1 ml-1" style={{ color: 'var(--text-muted)' }}>
          {formatTimestamp(timestamp)}
        </p>
      </div>
    </div>
  );
}

const QUICK_PROMPTS = [
  "What's my current balance?",
  "How do I dispute a charge?",
  "Check my loan status",
  "My card was stolen",
  "How do I enable 2FA?",
];

export default function MemberChat({ messages, onSendMessage, isTyping }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    onSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input, isTyping, onSendMessage]);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    const lineHeight = 24;
    const maxHeight = lineHeight * 4 + 16;
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + 'px';
  };

  const toggleAccordion = (msgId) => {
    setOpenAccordions((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    if (isListening) return; // Prevent multiple instances
    
    setIsListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev ? `${prev} ${transcript}` : transcript);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };
    
    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border-subtle)', background: 'rgba(13,17,23,0.8)' }}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div>
            <h2
              className="text-sm font-bold text-gradient-emerald"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              CreditAssist AI
            </h2>
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Powered by RAG · 847 docs indexed
            </p>
          </div>
        </div>
        <span
          className="text-xs font-mono px-2.5 py-1 rounded-lg"
          style={{
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.2)',
            color: '#3b82f6',
          }}
        >
          GPT-4 Turbo · Fine-tuned
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              💬
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              How can I help you today?
            </p>
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Ask about your balance, disputes, loans, or card services
            </p>
          </div>
        )}
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="flex justify-end animate-slide-up">
              <div className="max-w-sm">
                <div
                  className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm"
                  style={{
                    background: 'rgba(59,130,246,0.12)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {msg.content}
                </div>
                <p className="text-xs font-mono mt-1 text-right mr-1" style={{ color: 'var(--text-muted)' }}>
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            </div>
          ) : (
            <AIMessage
              key={msg.id}
              message={msg}
              isOpen={!!openAccordions[msg.id]}
              onToggle={() => toggleAccordion(msg.id)}
            />
          )
        )}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="flex-shrink-0 border-t px-6 py-4 space-y-3"
        style={{ borderColor: 'var(--border-subtle)', background: 'rgba(13,17,23,0.8)' }}
      >
        {/* Quick prompt pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                if (!isTyping) {
                  setInput(prompt);
                  textareaRef.current?.focus();
                }
              }}
              disabled={isTyping}
              className="flex-shrink-0 text-xs font-mono px-3 py-1.5 rounded-full transition-all duration-200 hover:border-white/20 disabled:opacity-40"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Textarea + send button */}
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder="Type your message… (Ctrl+Enter to send)"
            rows={1}
            className="flex-1 resize-none rounded-xl px-4 py-3 text-sm font-sans outline-none transition-all duration-200 disabled:opacity-50 focus:ring-1 focus:ring-emerald-500/40 placeholder-gray-600"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-primary)',
              caretColor: '#10b981',
              lineHeight: '1.5',
              maxHeight: '112px',
            }}
          />
          <button
            onClick={handleVoiceInput}
            title="Use voice input"
            disabled={isTyping || isListening}
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-40 border ${
              isListening
                ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <Mic size={16} className={isListening ? 'text-red-400' : 'text-gray-400'} />
          </button>
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40"
            style={{ background: '#10b981' }}
          >
            <Send size={16} className="text-gray-950" />
          </button>
        </div>
        <p className="text-xs font-mono text-center" style={{ color: 'var(--text-muted)' }}>
          This is an AI assistant. For urgent issues, call 1-800-555-CUCU.
        </p>
      </div>
    </div>
  );
}
