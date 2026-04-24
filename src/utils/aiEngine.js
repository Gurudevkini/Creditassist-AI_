export function generateCaseId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CASE-${num}`;
}

const ESCALATION_KEYWORDS = [
  "fraud", "stolen", "scam", "lawyer", "sue", "furious", "angry", "hack",
  "unauthorized", "identity theft", "corrupt", "breach",
  "overcharged", "called twice", "called multiple", "nothing resolved",
  "nobody helped", "still not resolved", "three months", "four months",
  "supervisor", "complaint", "consumer protection",
  "without my permission", "without permission", "permisson", "withdrawn", "withdrew", "took money"
];

// ── Multilingual Dictionary (Mock Detection & Translation) ───────────────
const LANGUAGE_MAP = [
  {
    language: "Hindi",
    keywords: ["मेरा", "बैलेंस", "क्या", "खाता", "बंद", "धन्यवाद"],
    translation: "Hello! According to our records, your current balance is $4,250.00. (Translated from internal system to Hindi: नमस्ते! हमारे रिकॉर्ड के अनुसार, आपका वर्तमान बैलेंस $4,250.00 है।)"
  },
  {
    language: "Kannada",
    keywords: ["ನನ್ನ", "ಖಾತೆ", "ಬ್ಯಾಲೆನ್ಸ್", "ಎಷ್ಟು", "ಸಮಸ್ಯೆ"],
    translation: "Hello! Your account balance is $4,250.00. (Translated from internal system to Kannada: ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಖಾತೆಯ ಬ್ಯಾಲೆನ್ಸ್ $4,250.00 ಆಗಿದೆ.)"
  },
  {
    language: "Tamil",
    keywords: ["என்", "கணக்கு", "இருப்பு", "எவ்வளவு", "வணக்கம்"],
    translation: "Hello! Your available balance is $4,250.00. (Translated from internal system to Tamil: வணக்கம்! உங்கள் கணக்கு இருப்பு $4,250.00 ஆகும்.)"
  }
];

// ── Sentiment Detection ────────────────────────────────────────────────────
// Each entry: [keyword, weight]  weight 1-3 (1=mild, 2=moderate, 3=severe)
const SENTIMENT_LEXICON = [
  // Distressed (weight 3)
  ["furious",       3], ["outraged",      3], ["disgusted",     3],
  ["livid",         3], ["devastated",    3], ["desperate",     3],
  ["panicking",     3], ["terrified",     3], ["humiliated",    3],

  // Frustrated (weight 2)
  ["frustrated",    2], ["angry",         2], ["upset",         2],
  ["annoyed",       2], ["fed up",        2], ["ridiculous",    2],
  ["unacceptable",  2], ["terrible",      2], ["horrible",      2],
  ["awful",         2], ["pathetic",      2], ["useless",       2],
  ["incompetent",   2], ["disappointed",  2], ["absurd",        2],
  ["furious",       2], ["sick of",       2], ["waste of time", 2],

  // Concerned (weight 1)
  ["worried",       1], ["concerned",     1], ["stressed",      1],
  ["scared",        1], ["unhappy",       1], ["not happy",     1],
  ["not satisfied", 1], ["issue",         1], ["problem",       1],
  ["still waiting", 1], ["keep waiting",  1], ["weeks",         1],
];

/**
 * Analyses the member message for sentiment signals.
 * Returns: { score: 0-100, label: 'neutral'|'concerned'|'frustrated'|'distressed', flaggedTerms: [] }
 */
export function detectSentiment(text) {
  const lower = text.toLowerCase();
  let totalWeight = 0;
  const flaggedTerms = [];

  for (const [term, weight] of SENTIMENT_LEXICON) {
    if (lower.includes(term)) {
      totalWeight += weight;
      if (!flaggedTerms.includes(term)) flaggedTerms.push(term);
    }
  }

  // Normalise to 0-100
  const score = Math.min(Math.round((totalWeight / 9) * 100), 100);

  let label;
  if (score === 0)       label = "neutral";
  else if (score <= 25)  label = "concerned";
  else if (score <= 55)  label = "frustrated";
  else                   label = "distressed";

  return { score, label, flaggedTerms };
}

function randomFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function processQuery(userMessage, knowledgeBase, history = []) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const normalized = userMessage.toLowerCase();
  
  // ── MULTILINGUAL INTERCEPTOR ───────────────────────────────────────────
  // Detect if the message contains regional text and route to the local language mapper
  for (const lang of LANGUAGE_MAP) {
    if (lang.keywords.some((kw) => userMessage.includes(kw))) {
      const sentiment = detectSentiment(userMessage); // Likely neutral since lexicon is English, but mock proceeds

      return {
        status: "resolved",
        intent: "general", // Auto-mapped via mock translation layer
        confidence: randomFloat(0.92, 0.98),
        sentiment,
        response: lang.translation,
        articleRef: "SYS-TRANSLATION-API",
        steps: [
          `Detected source language: ${lang.language}...`,
          "Routing to linguistic processing node...",
          "Translating input query to internal English token stream...",
          "Running unified intent classification model...",
          "Retrieving context from primary knowledge base...",
          `Applying auto-translation back to ${lang.language} for member...`
        ],
        processingMs: randomInt(800, 1400),
      };
    }
  }

  // Combine current message with recent history for context-aware matching
  const recentHistoryText = history.slice(-3).map(m => m.content.toLowerCase()).join(" ");
  const contextText = `${recentHistoryText} ${normalized}`;

  // ── Sentiment analysis (runs on every query) ───────────────────────────
  const sentiment = detectSentiment(userMessage);

  // ── ESCALATION CHECK FIRST ─────────────────────────────────────────────
  const foundEscalationKeywords = ESCALATION_KEYWORDS.filter((kw) =>
    normalized.includes(kw)
  );

  if (foundEscalationKeywords.length > 0) {
    const caseId = generateCaseId();
    const confidence = randomFloat(0.31, 0.49);
    const riskScore = randomInt(71, 94);

    // If distressed, bump risk score and flag priority
    const effectiveRisk = sentiment.label === "distressed"
      ? Math.min(riskScore + 8, 99)
      : riskScore;

    return {
      status: "escalated",
      intent: "undetermined",
      confidence,
      sentiment,
      response: `I've flagged this conversation for immediate review by a specialist. A member of our fraud and disputes team will contact you within 2 hours. Your case ID is ${caseId}. Please do not take any action on your accounts until you hear from us.`,
      caseId,
      steps: [
        "Tokenizing member query...",
        `Analyzing conversation history (${history.length} previous messages)...`,
        `Sentiment analysis: ${sentiment.label} (score: ${sentiment.score}/100)${sentiment.flaggedTerms.length ? ' — terms: ' + sentiment.flaggedTerms.slice(0, 3).join(', ') : ''}`,
        "Running intent classification model...",
        "High-risk pattern detected — bypassing automated resolution...",
        "Engaging escalation protocol ESCA-2...",
        "Notifying on-call staff via PagerDuty integration...",
        "Case created and assigned to fraud specialist queue.",
      ],
      processingMs: randomInt(1100, 1490),
      escalationSummary: {
        reason: "High-risk keyword detected",
        priority: sentiment.label === "distressed" ? "Critical" : "High",
        suggestedAction: sentiment.label === "distressed"
          ? "Immediate manual review — distressed member"
          : "Immediate manual review required",
        riskScore: effectiveRisk,
        flaggedKeywords: foundEscalationKeywords,
      },
    };
  }

  // ── SMALL TALK / CHIT-CHAT CHECK ───────────────────────────────────────
  const chitChatGreetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "thanks", "thank you"];
  const chitChatIdentity = ["what is your name", "who are you", "what are you"];
  
  // Only trigger chit-chat if it's a short/simple message that doesn't contain serious keywords
  const isGreetingWord = chitChatGreetings.some(kw => normalized === kw || normalized.startsWith(kw + " "));
  const isIdentity = chitChatIdentity.some(kw => normalized.includes(kw));
  
  if ((isGreetingWord || isIdentity || normalized.includes("thanks") || normalized.includes("thank you")) && !foundEscalationKeywords.length) {
    let answer = "Hello! I am CreditAssist AI. How can I help you with your account or banking operations today?";
    if (normalized.includes("thanks") || normalized.includes("thank you")) {
      answer = "You're very welcome! Let me know if you need help with anything else.";
    } else if (isIdentity) {
      answer = "I am CreditAssist AI, your virtual banking assistant. I can help you check balances, dispute charges, review policies, and more!";
    }

    return {
      status: "resolved",
      intent: "general",
      confidence: "0.99",
      sentiment,
      response: answer,
      articleRef: "SYS-GREETING",
      steps: [
        "Tokenizing member query...",
        `Sentiment analysis: ${sentiment.label} (score: ${sentiment.score}/100)`,
        "Running intent classification model...",
        "Intent detected: conversational (0.99)",
        "Bypassing KB search for standard dialogue...",
        "Generating friendly auto-response...",
      ],
      processingMs: randomInt(300, 600),
    };
  }

  // ── KB SEARCH ──────────────────────────────────────────────────────────
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    // Current message matching (primary signal)
    const currentMatches = entry.keywords.filter((kw) => normalized.includes(kw)).length;
    
    // History matching (context signal)
    const historyMatches = entry.keywords.filter((kw) => recentHistoryText.includes(kw)).length;
    
    const score = currentMatches + (historyMatches * 0.1);

    // Require at least 1 keyword in the current message, OR
    // allow history to carry over only if the current message is a short follow-up (<= 5 words)
    const isFollowUp = normalized.split(" ").length <= 5;

    if (score > bestScore && (currentMatches > 0 || (historyMatches > 0 && isFollowUp))) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    const confidence = randomFloat(0.91, 0.99);
    return {
      status: "resolved",
      intent: bestMatch.category,
      confidence,
      sentiment,
      response: bestMatch.answer,
      articleRef: bestMatch.articleRef,
      steps: [
        "Tokenizing member query...",
        `Sentiment analysis: ${sentiment.label} (score: ${sentiment.score}/100)`,
        "Running intent classification model...",
        `Intent detected: ${bestMatch.category} (${confidence})`,
        "Performing semantic vector search across 847 policy documents...",
        `Top match: ${bestMatch.articleRef} (cosine similarity: ${confidence})`,
        "Generating member-safe response...",
      ],
      processingMs: randomInt(1100, 1490),
    };
  }

  // ── No match → escalate ─────────────────────────────────────────────────
  const caseId = generateCaseId();
  const confidence = randomFloat(0.31, 0.49);
  const riskScore = randomInt(71, 94);
  return {
    status: "escalated",
    intent: "undetermined",
    confidence,
    sentiment,
    response: `I've flagged this conversation for immediate review by a specialist. A member of our fraud and disputes team will contact you within 2 hours. Your case ID is ${caseId}. Please do not take any action on your accounts until you hear from us.`,
    caseId,
    steps: [
      "Tokenizing member query...",
      `Sentiment analysis: ${sentiment.label} (score: ${sentiment.score}/100)`,
      "Running intent classification model...",
      "High-risk pattern detected — bypassing automated resolution...",
      "Engaging escalation protocol ESCA-2...",
      "Notifying on-call staff via PagerDuty integration...",
      "Case created and assigned to fraud specialist queue.",
    ],
    processingMs: randomInt(1100, 1490),
    escalationSummary: {
      reason: "Query outside knowledge domain",
      priority: sentiment.label === "distressed" ? "Critical" : "High",
      suggestedAction: sentiment.label === "distressed"
        ? "Immediate manual review — distressed member"
        : "Immediate manual review required",
      riskScore,
      flaggedKeywords: ["low confidence match"],
    },
  };
}
