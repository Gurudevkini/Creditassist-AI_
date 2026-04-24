const knowledgeBase = [
  // BALANCE (3)
  {
    id: "kb-001",
    category: "balance",
    keywords: ["balance", "current", "available", "funds", "account"],
    question: "How do I check my current account balance?",
    answer: "Your available balance is updated in real-time and reflects all posted transactions. You can view it in Online Banking, our mobile app, or by calling 1-800-555-CUCU. Note that pending transactions may reduce your available balance up to 3 business days before they officially post.",
    articleRef: "POL-2024-BAL-011",
  },
  {
    id: "kb-002",
    category: "balance",
    keywords: ["pending", "transaction", "hold", "posting", "cleared"],
    question: "Why is my transaction still pending?",
    answer: "Pending transactions typically clear within 1-3 business days, depending on the merchant's processing schedule. Debit card transactions may be held for up to 5 business days for certain merchant categories such as hotels or car rentals. If a pending transaction exceeds 7 days, please contact member services at ext. 204.",
    articleRef: "POL-2024-BAL-019",
  },
  {
    id: "kb-003",
    category: "balance",
    keywords: ["overdraft", "fee", "insufficient", "overdrawn", "negative"],
    question: "What are the overdraft fees and how do I avoid them?",
    answer: "Overdraft fees are $28 per occurrence, with a maximum of 4 fees per day ($112). Members enrolled in Overdraft Protection Service can link a savings account to cover shortfalls at no fee for transfers up to $500. You may opt in to overdraft coverage for ATM and one-time debit transactions; without opt-in, these transactions are declined at no charge.",
    articleRef: "POL-2024-BAL-033",
  },
  // DISPUTE (3)
  {
    id: "kb-004",
    category: "dispute",
    keywords: ["dispute", "charge", "transaction", "unauthorized", "wrong"],
    question: "How do I dispute a charge on my account?",
    answer: "To dispute a transaction, log into Online Banking and select the transaction, then click 'Dispute This Transaction', or call 1-800-555-CUCU within 60 days of the statement date. For debit card errors, provisional credit may be applied within 5 business days while we investigate. Disputes typically resolve within 10-45 business days per Regulation E.",
    articleRef: "POL-2024-DIS-041",
  },
  {
    id: "kb-005",
    category: "dispute",
    keywords: ["refund", "merchant", "return", "credit", "chargeback"],
    question: "The merchant won't give me a refund. What can I do?",
    answer: "If a merchant refuses to issue a refund for a valid return or cancelled service, you may initiate a chargeback through our disputes team. Please retain all receipts, email correspondence, and evidence of the return or cancellation. Chargebacks must be filed within 120 days of the original transaction date, and processing takes 15-30 business days.",
    articleRef: "POL-2024-DIS-047",
  },
  {
    id: "kb-006",
    category: "dispute",
    keywords: ["double", "duplicate", "charged twice", "billed", "error"],
    question: "I was charged twice for the same purchase.",
    answer: "Duplicate charges can occur due to merchant processing errors. Please allow 3-5 business days for the duplicate to self-reverse before filing a dispute, as many systems automatically catch these. If the duplicate charge persists after 5 business days, contact us and reference policy POL-2024-DIS-052 for expedited review. Provisional credit is typically issued within 2 business days for confirmed duplicates.",
    articleRef: "POL-2024-DIS-052",
  },
  // LOAN (3)
  {
    id: "kb-007",
    category: "loan",
    keywords: ["loan", "apply", "application", "borrow", "personal", "auto"],
    question: "How do I apply for a personal or auto loan?",
    answer: "Loan applications can be submitted online at our member portal, in-branch, or by phone. Decisions on personal loans up to $25,000 are typically made within 24 hours; auto loans may take 1-2 business days. You'll need to provide proof of income, two recent pay stubs, and government-issued ID. Rates start at 7.99% APR based on creditworthiness.",
    articleRef: "POL-2024-LN-061",
  },
  {
    id: "kb-008",
    category: "loan",
    keywords: ["loan", "status", "approved", "decision", "underwriting"],
    question: "How can I check my loan application status?",
    answer: "Loan application status is available 24/7 in your Online Banking portal under 'My Applications'. You will also receive email and SMS notifications at key milestones: submission confirmed, under review, decision rendered, and funding scheduled. If your application has been under review for more than 3 business days without a decision, contact our Lending Center at ext. 312.",
    articleRef: "POL-2024-LN-068",
  },
  {
    id: "kb-009",
    category: "loan",
    keywords: ["payment", "loan payment", "due", "payoff", "schedule", "interest"],
    question: "How do I make a loan payment or view my payoff amount?",
    answer: "Loan payments can be made via Online Banking, AutoPay enrollment, in-branch, or by mailing a check to our Loan Servicing department. Your current payoff amount, including accrued interest, is displayed in the Loans section of your member portal and is updated daily. Payoff quotes are valid for 10 days; a final payoff letter costs $15 per request.",
    articleRef: "POL-2024-LN-079",
  },
  // CARD (3)
  {
    id: "kb-010",
    category: "card",
    keywords: ["card", "stolen", "lost", "replace", "replacement", "cancel"],
    question: "My debit card was lost or stolen. What should I do?",
    answer: "Immediately lock your card via the mobile app or call our 24/7 card services hotline at 1-888-555-CARD to report it lost or stolen. A replacement card will be issued and mailed within 5-7 business days; expedited shipping is available for $15. Any unauthorized transactions after the reported time are fully covered under our Zero Liability Policy.",
    articleRef: "POL-2024-CARD-081",
  },
  {
    id: "kb-011",
    category: "card",
    keywords: ["pin", "change", "reset", "atm", "debit pin"],
    question: "How do I change or reset my debit card PIN?",
    answer: "You may change your PIN at any of our in-network ATMs by selecting 'PIN Services' from the main menu, or by calling the automated PIN reset line at 1-888-555-PIN1 (available 24/7). For security, PIN changes at ATMs require the current PIN; if you've forgotten yours, a reset link can be sent to your verified mobile number. New PINs take effect within 15 minutes.",
    articleRef: "POL-2024-CARD-089",
  },
  {
    id: "kb-012",
    category: "card",
    keywords: ["freeze", "lock", "suspend", "block", "travel", "card"],
    question: "Can I temporarily freeze my card while traveling?",
    answer: "Yes, you can freeze and unfreeze your debit card instantly through the mobile app under Card Controls, with no fees. We also recommend setting a Travel Notice before international travel to prevent false fraud alerts — this can be set for up to 90 days and extended as needed. Card freezes do not affect recurring ACH payments or scheduled transfers.",
    articleRef: "POL-2024-CARD-094",
  },
  // SECURITY (3)
  {
    id: "kb-013",
    category: "security",
    keywords: ["password", "reset", "login", "access", "locked", "account"],
    question: "I'm locked out of my online banking account.",
    answer: "Online Banking accounts are locked after 5 consecutive failed login attempts for your protection. To unlock, click 'Forgot Password' on the login page and follow the identity verification steps via email or SMS OTP. If you no longer have access to your registered email or phone, call member services at 1-800-555-CUCU with your government ID and account number for in-person verification.",
    articleRef: "POL-2024-SEC-101",
  },
  {
    id: "kb-014",
    category: "security",
    keywords: ["two factor", "2fa", "authentication", "security", "enable", "mfa"],
    question: "How do I enable two-factor authentication (2FA)?",
    answer: "Two-factor authentication can be enabled under Settings > Security > Two-Factor Authentication in Online Banking. We support SMS codes, authenticator apps (Google Authenticator, Authy), and hardware security keys. Once enabled, 2FA is required for all logins and high-risk transactions above $500. We strongly recommend all members enable 2FA — it reduces account takeover risk by over 99%.",
    articleRef: "POL-2024-SEC-108",
  },
  {
    id: "kb-015",
    category: "security",
    keywords: ["phishing", "email", "suspicious", "scam", "fake", "report"],
    question: "I received a suspicious email claiming to be from the credit union.",
    answer: "We will never ask for your full account number, PIN, or password via email or phone. If you receive a suspicious message, do not click any links — forward it to security@creditassist.cu and then delete it. You can verify whether any communication is legitimate by calling 1-800-555-CUCU directly. Members who report phishing attempts help protect the entire membership community.",
    articleRef: "POL-2024-SEC-115",
  },

  // ACCOUNT UPDATE (3) — Required by problem statement
  {
    id: "kb-016",
    category: "account",
    keywords: ["address", "update", "change", "moved", "new address", "registered", "submit"],
    question: "I recently moved. How do I update my registered address?",
    answer: "To update your registered address, log into Online Banking and go to Settings > Personal Information > Update Address. You will need to provide your new address and verify your identity via OTP sent to your registered mobile number. Alternatively, visit any branch with a government-issued photo ID and a utility bill or lease agreement as proof of new address. Address changes take effect within 1 business day.",
    articleRef: "POL-2024-ACC-121",
  },
  {
    id: "kb-017",
    category: "account",
    keywords: ["phone", "mobile", "email", "contact", "update", "change", "information", "personal"],
    question: "How do I update my phone number or email address?",
    answer: "Contact information updates can be made in Online Banking under Settings > Personal Information. To change your mobile number, you must first verify the new number with an OTP. Email changes require confirmation from your current registered email for security. If you have lost access to both, please visit any branch with your government-issued ID for in-person verification.",
    articleRef: "POL-2024-ACC-127",
  },
  {
    id: "kb-018",
    category: "account",
    keywords: ["nominee", "beneficiary", "joint", "account holder", "name", "update"],
    question: "How do I update nominee or beneficiary details on my account?",
    answer: "Nominee and beneficiary updates require you to visit your nearest branch with the completed Nomination Form (Form-N), the nominee's government-issued ID, and one passport-size photograph. Changes cannot be processed online for security and legal compliance reasons. Processing time is 3-5 business days after document submission.",
    articleRef: "POL-2024-ACC-133",
  },

  // CARD REACTIVATION — Explicit scenario from problem statement PDF
  {
    id: "kb-019",
    category: "card",
    keywords: ["blocked", "reactivate", "reactivation", "failed pin", "pin attempts", "card blocked", "unblock"],
    question: "My debit card got blocked after 3 failed PINs. How do I get it reactivated?",
    answer: "Your card is temporarily blocked after 3 consecutive incorrect PIN entries as a security measure. To reactivate it: (1) Call our 24/7 card hotline at 1-888-555-CARD and complete identity verification, or (2) Visit your nearest branch with your government-issued ID. Once verified, your card will be unblocked immediately and you can reset your PIN at any ATM. Online reactivation is not available for security reasons.",
    articleRef: "POL-2024-CARD-097",
  },

  // POLICY / FIXED DEPOSIT — Explicit scenario from problem statement PDF
  {
    id: "kb-020",
    category: "policy",
    keywords: ["fixed deposit", "fd", "maturity", "penalty", "close", "premature", "withdrawal", "early"],
    question: "What is the penalty for closing a fixed deposit before maturity?",
    answer: "Premature closure of a Fixed Deposit (FD) is subject to a penalty of 1% on the applicable interest rate. For example, if your FD earns 7.5% p.a., premature closure earns 6.5% p.a. for the actual holding period. No interest is paid if the FD is closed within 7 days of opening. To close an FD early, submit a written request at any branch or raise a request in Online Banking under Deposits > Fixed Deposits > Close Early.",
    articleRef: "POL-2024-DEP-145",
  },

  // INTEREST RATES — Required coverage per RAG requirement
  {
    id: "kb-021",
    category: "policy",
    keywords: ["interest rate", "savings rate", "rate", "apy", "apr", "return", "yield", "deposit rate"],
    question: "What are the current interest rates for savings and deposits?",
    answer: "Our current rates (effective Q1 2024): Regular Savings Account — 4.25% APY; High-Yield Savings — 5.10% APY; 6-Month Fixed Deposit — 6.75% APY; 12-Month Fixed Deposit — 7.50% APY; 24-Month Fixed Deposit — 7.90% APY. Loan rates start at 7.99% APR for personal loans and 6.49% APR for auto loans. Rates are subject to change; view live rates at creditassist.cu/rates.",
    articleRef: "POL-2024-RATE-150",
  },

  // OVERCHARGE / CHRONIC COMPLAINT — Explicit scenario from problem statement PDF
  {
    id: "kb-022",
    category: "dispute",
    keywords: ["overcharged", "overcharge", "months", "repeated", "called", "nothing resolved", "still", "again", "multiple times"],
    question: "I've been overcharged for multiple months and my issue hasn't been resolved.",
    answer: "We sincerely apologize for this ongoing issue. For recurring billing errors or unresolved complaints that have been reported multiple times, you are entitled to escalated resolution under our Member Advocacy Policy. Please call our dedicated Escalation Line at 1-800-555-CUCU ext. 999, or ask any staff member to log a formal complaint (Form-C). We are required to resolve formally logged complaints within 5 business days and will issue fee reversals for all confirmed overcharges.",
    articleRef: "POL-2024-DIS-060",
  },
];

export default knowledgeBase;
