# CreditAssist AI 🏦

![CreditAssist AI Banner](https://via.placeholder.com/1000x300/111827/FFFFFF?text=CreditAssist+AI+-+Xypheria+2026)

**CreditAssist AI** is a full-stack, AI-powered Member Support & Resolution system built specifically for Credit Unions. It was developed as a submission for the **INNORVE Xypheria 2026 Hackathon**. 

Rather than building a simple "chatbot," this project introduces a true **Enterprise System** consisting of a Member Intake UI, an AI Resolution Engine (Mock RAG), and a Staff Operations Center.

---

## 🏆 Project Achievements & Features

This project successfully implements **100% of the Core Deliverables** and **100% of the Bonus Deliverables** requested by the Innove judging panel.

### Core Architecture
1. **Layer 1: Member Interface**: A premium, dual-pane, dark-themed UI built with React. Features quick-actions, a clean typing indicator, and dynamic UI state management.
2. **Layer 2: AI Resolution Engine**: A custom pseudo-RAG engine loaded with 22+ extensive Credit Union policy documents. It intelligently classifies intent, detects fraud, and parses queries vs. documents.
3. **Layer 3: Staff Operations Dashboard**: A fully functional, responsive HTML/CSS grid dashboard showing Live Cases, actionable KPI metrics (Resolution Rate, Handling Time), and auto-escalated cases.

### 🔥 5/5 Bonus Requirements Completed
- **Sentiment Detection**: Custom lexicon mapping successfully flags "Distressed" or "Frustrated" members, bumping their Risk Score and visually alerting Staff with 🔥 priority badges.
- **Multi-turn Memory**: State preservation maintains chat context across 3+ messages, allowing the RAG engine to understand complex follow-up queries.
- **Analytics Layer**: Dynamic visualization using real-time local state to map the exact distribution of issues (e.g., Disputes vs Loans).
- **Multilingual Support**: Integrated Linguistic Interceptors allow members to query the bot and receive custom banking responses in **Hindi, Kannada, and Tamil**.
- **Voice Input**: Fully integrated `Web Speech API` in the Member UI allowing users to verbally dictate their problems.

---

## 🛠️ Technology Stack
- **Frontend Framework**: React + Vite
- **Styling**: Tailwind CSS + Lucide Icons (Lucide-react)
- **Data Persistence**: HTML5 `localStorage` (Simulates a production database for Hackathon requirements)
- **System Theme**: Dark-Mode Glassmorphism (`Syne` and `Inter` typography)

---

## 🚀 Running Locally

Because this project uses a simulated frontend-focused backend (specifically requested by the hackathon constraints to avoid hard-coded API dependencies), running it locally is instantaneous.

```bash
# 1. Clone the repository
git clone https://github.com/Gurudevkini/Creditassist-AI_.git

# 2. Navigate to the project directory
cd Creditassist-AI_
# (If your files are nested, run `cd creditassist-ai-fixed`)

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

### Resetting the Database
To clear the simulated database (which populates the Staff Dashboard), click the small **"Reset System"** button in the top right corner of the Member Chat overlay. This will wipe the `localStorage` state and reload the default application.

---

## 🧠 System Intelligence Examples

Try these prompts locally or on the live deployment to trigger the engine:
* **Balance (RAG)**: "What is my account balance?"
* **Voice**: Click the microphone icon and speak.
* **Multilingual**: "ನನ್ನ ಖಾತೆ ಬ್ಯಾಲೆನ್ಸ್ ಎಷ್ಟು?" (Kannada) or "मेरा बैलेंस क्या है?" (Hindi).
* **Fraud Escalation**: "someone withdrew money without my permission." -> *Instantly routes to the highest priority in the Staff Dashboard.*
* **Chit-Chat Interceptor**: "What is your name?" or "Thank you!" -> *Provides a conversational response without breaking the RAG loop.*

---
*Built with ❤️ for INNORVE Xypheria 2026.*
