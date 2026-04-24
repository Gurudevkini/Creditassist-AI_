import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Clock, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';

function formatTimestamp(date) {
  return 'Today, ' + new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const categoryColors = {
  balance: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  dispute: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  loan: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  card: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  security: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  account: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  policy: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  general: 'text-gray-400 bg-white/5 border-white/10',
  undetermined: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

function ConversationThread({ messages }) {
  if (!messages || messages.length === 0) {
    return (
      <p className="text-xs font-mono text-center py-3" style={{ color: 'var(--text-muted)' }}>
        No conversation history available.
      </p>
    );
  }
  return (
    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        const isEsc = msg.aiResult?.status === 'escalated';
        return (
          <div key={msg.id} className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] rounded-xl px-3 py-2 text-xs"
              style={
                isUser
                  ? { background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: 'var(--text-primary)' }
                  : {
                      background: isEsc ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                      border: `1px solid ${isEsc ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
                      color: 'var(--text-primary)',
                    }
              }
            >
              <p className="leading-relaxed">{msg.content}</p>
              <p className="mt-1 text-right" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                {isUser ? '👤 Member' : `🤖 AI${msg.aiResult ? ` · ${msg.aiResult.confidence} conf.` : ''}`}
                {' · '}
                {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Sentiment badge config
const SENTIMENT_CONFIG = {
  distressed: { emoji: '🔥', label: 'Distressed', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', pulse: true },
  frustrated:  { emoji: '⚡', label: 'Frustrated',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', pulse: false },
  concerned:   { emoji: '💛', label: 'Concerned',   color: '#eab308', bg: 'rgba(234,179,8,0.10)',  border: 'rgba(234,179,8,0.20)',  pulse: false },
  neutral:     null,
};

export default function CaseCard({ caseData, onResolveCase }) {
  const [showThread, setShowThread] = useState(false);
  const { id, memberMessage, aiResult, timestamp, resolvedBy, conversationThread } = caseData;
  const isEscalated = aiResult.status === 'escalated';
  const isManuallyResolved = resolvedBy === 'agent' || resolvedBy === 'resolved';
  const isResolved = !isEscalated || isManuallyResolved;

  const sentiment = aiResult.sentiment || null;
  const sentimentCfg = sentiment ? SENTIMENT_CONFIG[sentiment.label] : null;

  // Distressed cases get an intensified red glow border
  const borderColor = isResolved ? '#10b981' : (sentimentCfg?.label === 'Distressed' ? '#ff2222' : '#ef4444');
  const catClass = categoryColors[aiResult.intent] || categoryColors.undetermined;

  return (
    <div
      className="glass-card rounded-2xl p-4 relative transition-all duration-500 animate-slide-up"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        boxShadow: sentimentCfg?.label === 'Distressed'
          ? '0 0 28px rgba(239,68,68,0.18)'
          : isResolved
            ? '0 0 20px rgba(16,185,129,0.08)'
            : '0 0 20px rgba(239,68,68,0.08)',
      }}
    >
      {/* Pulsing dot for active escalations */}
      {isEscalated && !isManuallyResolved && (
        <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pr-6">
        {isEscalated && !isManuallyResolved ? (
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 border border-red-500/25">
            CRITICAL
          </span>
        ) : (
          <span className={`text-xs font-mono px-2 py-0.5 rounded-md border capitalize ${catClass}`}>
            {aiResult.intent}
          </span>
        )}
        {isManuallyResolved && (
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {resolvedBy === 'agent' ? 'Taken Over' : 'Manually Resolved'}
          </span>
        )}
        {/* Sentiment badge */}
        {sentimentCfg && (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-md flex items-center gap-1"
            style={{ background: sentimentCfg.bg, border: `1px solid ${sentimentCfg.border}`, color: sentimentCfg.color }}
          >
            {sentimentCfg.pulse && (
              <span className="relative flex h-1.5 w-1.5 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: sentimentCfg.color }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: sentimentCfg.color }} />
              </span>
            )}
            {sentimentCfg.emoji} {sentimentCfg.label}
          </span>
        )}
        <span className="text-xs font-mono ml-auto flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <Clock size={10} />
          {formatTimestamp(timestamp)}
        </span>
      </div>
      {/* Sentiment score bar — only shown when sentiment detected */}
      {sentimentCfg && sentiment && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Sentiment score</span>
            <span className="text-xs font-mono" style={{ color: sentimentCfg.color }}>{sentiment.score}/100</span>
          </div>
          <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${sentiment.score}%`, background: sentimentCfg.color, opacity: 0.8 }}
            />
          </div>
          {sentiment.flaggedTerms?.length > 0 && (
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
              Terms: {sentiment.flaggedTerms.slice(0, 4).join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Member message */}
      <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
        {memberMessage}
      </p>

      {/* Resolved card content */}
      {!isEscalated && (
        <>
          <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {aiResult.response}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ⬡ {aiResult.confidence} confidence
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              📎 {aiResult.articleRef}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 ml-auto flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={10} className="text-emerald-400" />
              Resolved by AI
            </span>
          </div>
        </>
      )}

      {/* Escalated card content */}
      {isEscalated && (
        <>
          {/* Escalation summary box */}
          <div
            className="rounded-xl p-3 mb-3 text-xs font-mono space-y-1.5"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Reason</span>
              <span style={{ color: '#f0f6fc' }}>{aiResult.escalationSummary?.reason}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Risk Score</span>
              <span className="text-red-400 font-semibold">{aiResult.escalationSummary?.riskScore}/100</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              <span style={{ color: 'var(--text-muted)' }}>Keywords:</span>
              {(aiResult.escalationSummary?.flaggedKeywords || []).map((kw) => (
                <span
                  key={kw}
                  className="px-1.5 py-0.5 rounded text-red-300 text-xs"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)' }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Suggested action */}
          <div
            className="rounded-lg px-3 py-2 mb-3 text-xs font-mono flex items-center gap-2"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}
          >
            <AlertTriangle size={12} />
            {aiResult.escalationSummary?.suggestedAction}
          </div>

          {/* Case ID */}
          {aiResult.caseId && (
            <p className="text-xs font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
              Case: <span style={{ color: '#f0f6fc' }}>{aiResult.caseId}</span>
            </p>
          )}

          {/* Action buttons */}
          {!isManuallyResolved && (
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => onResolveCase(id, 'agent')}
                className="flex-1 text-xs font-mono py-2 rounded-lg border transition-all duration-200 hover:bg-blue-500/10"
                style={{ borderColor: '#3b82f6', color: '#3b82f6' }}
              >
                Take Over
              </button>
              <button
                onClick={() => onResolveCase(id, 'resolved')}
                className="flex-1 text-xs font-mono py-2 rounded-lg transition-all duration-200 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold"
              >
                Mark Resolved
              </button>
            </div>
          )}

          {isManuallyResolved && (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 size={12} />
              <span>Case closed by staff</span>
            </div>
          )}
        </>
      )}

      {/* Full Conversation Thread — always visible toggle */}
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => setShowThread((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-80 w-full"
          style={{ color: 'var(--text-muted)' }}
        >
          {showThread ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          <MessageSquare size={11} />
          {showThread ? 'Hide' : 'View full'} conversation
          {conversationThread && (
            <span
              className="ml-auto px-1.5 py-0.5 rounded-full text-xs font-mono"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
            >
              {conversationThread.length} msg{conversationThread.length !== 1 ? 's' : ''}
            </span>
          )}
        </button>
        {showThread && (
          <div
            className="mt-2 rounded-xl p-3"
            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <ConversationThread messages={conversationThread} />
          </div>
        )}
      </div>
    </div>
  );
}
