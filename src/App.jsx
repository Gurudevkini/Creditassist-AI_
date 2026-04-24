import React, { useState, useCallback, useRef, useEffect } from 'react';
import MemberChat from './components/MemberChat.jsx';
import StaffDashboard from './components/StaffDashboard.jsx';
import { processQuery, generateCaseId } from './utils/aiEngine.js';
import knowledgeBase from './data/knowledgeBase.js';

function seedTimestamp(minutesAgo) {
  return new Date(Date.now() - minutesAgo * 60 * 1000);
}

const SEED_CASES = [
  {
    id: 'CASE-100001',
    memberMessage: 'What is the status of my loan application? I applied 2 days ago and haven\'t heard back.',
    aiResult: {
      status: 'resolved',
      intent: 'loan',
      confidence: '0.96',
      response: 'Loan application status is available 24/7 in your Online Banking portal under \'My Applications\'. You will also receive email and SMS notifications at key milestones: submission confirmed, under review, decision rendered, and funding scheduled. If your application has been under review for more than 3 business days without a decision, contact our Lending Center at ext. 312.',
      articleRef: 'POL-2024-LN-068',
      steps: [
        'Tokenizing member query...',
        'Running intent classification model...',
        'Intent detected: loan (0.96)',
        'Performing semantic vector search across 847 policy documents...',
        'Top match: POL-2024-LN-068 (cosine similarity: 0.96)',
        'Generating member-safe response...',
      ],
      processingMs: 1287,
    },
    timestamp: seedTimestamp(13),
    resolvedBy: null,
    resolvedAt: null,
    conversationThread: [
      {
        id: 'seed-msg-1',
        role: 'user',
        content: 'Hi, I need help with my loan application.',
        timestamp: seedTimestamp(14),
        aiResult: null,
      },
      {
        id: 'seed-msg-2',
        role: 'assistant',
        content: 'Hello! I\'d be happy to help with your loan application. Could you provide more details about your inquiry?',
        timestamp: seedTimestamp(14),
        aiResult: { status: 'resolved', confidence: '0.88', intent: 'loan' },
      },
      {
        id: 'seed-msg-3',
        role: 'user',
        content: 'What is the status of my loan application? I applied 2 days ago and haven\'t heard back.',
        timestamp: seedTimestamp(13),
        aiResult: null,
      },
      {
        id: 'seed-msg-4',
        role: 'assistant',
        content: 'Loan application status is available 24/7 in your Online Banking portal under \'My Applications\'. You will also receive email and SMS notifications at key milestones: submission confirmed, under review, decision rendered, and funding scheduled. If your application has been under review for more than 3 business days without a decision, contact our Lending Center at ext. 312.',
        timestamp: seedTimestamp(13),
        aiResult: { status: 'resolved', confidence: '0.96', intent: 'loan', articleRef: 'POL-2024-LN-068' },
      },
    ],
  },
  {
    id: 'CASE-100002',
    memberMessage: 'I think there has been fraud on my account. There are charges I did not authorize and I am very concerned.',
    aiResult: {
      status: 'escalated',
      intent: 'undetermined',
      confidence: '0.37',
      response: 'I\'ve flagged this conversation for immediate review by a specialist. A member of our fraud and disputes team will contact you within 2 hours. Your case ID is CASE-100002. Please do not take any action on your accounts until you hear from us.',
      caseId: 'CASE-100002',
      steps: [
        'Tokenizing member query...',
        'Running intent classification model...',
        'High-risk pattern detected — bypassing automated resolution...',
        'Engaging escalation protocol ESCA-2...',
        'Notifying on-call staff via PagerDuty integration...',
        'Case created and assigned to fraud specialist queue.',
      ],
      processingMs: 1341,
      escalationSummary: {
        reason: 'High-risk keyword detected',
        priority: 'Critical',
        suggestedAction: 'Immediate manual review required',
        riskScore: 87,
        flaggedKeywords: ['fraud', 'unauthorized'],
      },
    },
    timestamp: seedTimestamp(10),
    resolvedBy: null,
    resolvedAt: null,
    conversationThread: [
      {
        id: 'seed-msg-5',
        role: 'user',
        content: 'I think there has been fraud on my account. There are charges I did not authorize and I am very concerned.',
        timestamp: seedTimestamp(10),
        aiResult: null,
      },
      {
        id: 'seed-msg-6',
        role: 'assistant',
        content: 'I\'ve flagged this conversation for immediate review by a specialist. A member of our fraud and disputes team will contact you within 2 hours. Your case ID is CASE-100002. Please do not take any action on your accounts until you hear from us.',
        timestamp: seedTimestamp(10),
        aiResult: { status: 'escalated', confidence: '0.37', intent: 'undetermined', caseId: 'CASE-100002' },
      },
    ],
  },
];

let msgCounter = 0;

export default function App() {
  // Load from localStorage or fallback to defaults
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ca-messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [cases, setCases] = useState(() => {
    const saved = localStorage.getItem('ca-cases');
    return saved ? JSON.parse(saved).map(c => ({
      ...c,
      timestamp: new Date(c.timestamp),
      resolvedAt: c.resolvedAt ? new Date(c.resolvedAt) : null,
      conversationThread: c.conversationThread ? c.conversationThread.map(m => ({ ...m, timestamp: new Date(m.timestamp) })) : []
    })) : SEED_CASES;
  });

  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('member');
  const [staffAlert, setStaffAlert] = useState(false);
  const alertTimerRef = useRef(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('ca-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ca-cases', JSON.stringify(cases));
  }, [cases]);

  const handleResetData = () => {
    if (window.confirm("This will clear all chat and case history. Are you sure?")) {
      localStorage.removeItem('ca-messages');
      localStorage.removeItem('ca-cases');
      window.location.reload();
    }
  };

  const handleSendMessage = useCallback(async (userText) => {
    const userMsg = {
      id: `msg-${++msgCounter}-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date(),
      aiResult: null,
    };

    // Capture snapshot of existing messages BEFORE state update
    let snapshotBefore = [];
    setMessages((prev) => {
      snapshotBefore = prev;
      return [...prev, userMsg];
    });
    setIsTyping(true);

    const result = await processQuery(userText, knowledgeBase, snapshotBefore);

    setIsTyping(false);

    const aiMsg = {
      id: `msg-${++msgCounter}-${Date.now()}`,
      role: 'assistant',
      content: result.response,
      timestamp: new Date(),
      aiResult: result,
    };

    setMessages((prev) => [...prev, aiMsg]);

    // Full conversation thread: all prior messages + this exchange
    const conversationThread = [...snapshotBefore, userMsg, aiMsg];

    const newCase = {
      id: result.caseId || generateCaseId(),
      memberMessage: userText,
      aiResult: result,
      timestamp: new Date(),
      resolvedBy: null,
      resolvedAt: null,
      conversationThread,
    };

    setCases((prev) => [newCase, ...prev]);

    if (result.status === 'escalated' && activeTab === 'member') {
      setStaffAlert(true);
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
      alertTimerRef.current = setTimeout(() => setStaffAlert(false), 8000);
    }
  }, [activeTab]);

  const handleResolveCase = useCallback((caseId, resolution) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, resolvedBy: resolution, resolvedAt: new Date() }
          : c
      )
    );
  }, []);

  const unresolved = cases.filter(
    (c) => c.aiResult.status === 'escalated' && c.resolvedBy == null
  );
  const hasUnresolvedEscalations = unresolved.length > 0;

  return (
    <div
      className="flex flex-col h-full dot-grid"
      style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #0d1117 0%, #030712 70%)' }}
    >
      {/* Radial glow overlay */}
      <div className="radial-glow absolute inset-0 pointer-events-none" />

      {/* Navigation bar */}
      <nav
        className="relative z-10 flex items-center justify-between px-6 flex-shrink-0"
        style={{
          height: '56px',
          background: 'rgba(3,7,18,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-sm font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
            <span style={{ color: 'var(--text-primary)' }}>Credit</span>
            <span className="text-gradient-emerald">Assist</span>
            <span style={{ color: 'var(--text-primary)' }}> AI</span>
          </span>
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            &lt;v2.4.1&gt;
          </span>
        </div>

        {/* Tab buttons */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={() => setActiveTab('member')}
            className="relative px-4 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
            style={
              activeTab === 'member'
                ? {
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: 'var(--text-primary)',
                  }
                : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: 'var(--text-muted)',
                  }
            }
          >
            Member Interface
          </button>
          <button
            onClick={() => { setActiveTab('staff'); setStaffAlert(false); }}
            className="relative px-4 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
            style={
              activeTab === 'staff'
                ? {
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: 'var(--text-primary)',
                  }
                : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: 'var(--text-muted)',
                  }
            }
          >
            Staff Dashboard
            {(hasUnresolvedEscalations || staffAlert) && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
            )}
          </button>
        </div>

        {/* Status + Reset */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleResetData}
            className="text-[10px] font-mono px-2 py-1 rounded opacity-40 hover:opacity-100 hover:bg-white/10 transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Reset System
          </button>
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Connected
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex-1 min-h-0">
        <div
          className="h-full transition-opacity duration-300"
          style={{ opacity: activeTab === 'member' ? 1 : 0, pointerEvents: activeTab === 'member' ? 'auto' : 'none', position: 'absolute', inset: 0 }}
        >
          <MemberChat
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>
        <div
          className="h-full transition-opacity duration-300"
          style={{ opacity: activeTab === 'staff' ? 1 : 0, pointerEvents: activeTab === 'staff' ? 'auto' : 'none', position: 'absolute', inset: 0 }}
        >
          <StaffDashboard cases={cases} onResolveCase={handleResolveCase} />
        </div>
      </div>
    </div>
  );
}
