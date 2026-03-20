# Agentic AI Contracts Specialist: Intelligence Hub 🚀

[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688.svg)]()
[![Google ADK](https://img.shields.io/badge/ADK-Google_Agent_Kit-4285F4.svg)]()
[![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB.svg)]()

An advanced **Agentic AI** platform designed using the **Google Agent Development Kit (ADK)** to automate and deepen contract performance evaluation. Moving beyond simple data visualization, this system functions as an **Autonomous Contracts Agent**, utilizing a multi-agent swarm to reason through complex data for executive-level, audit-ready recommendations.

---

## 🏗️ System Architecture (Google ADK Core)

The system leverages the **Google ADK** for sophisticated agent orchestration, stateful session management, and robust multi-agent coordination.

```mermaid
graph TD
    subgraph Data_Layer [Data Ingestion]
        P_Data[Perf .csv] -->|Load| E[Executor]
        I_Data[Incidents .json] -->|Load| E
        R_Data[Reviews .md] -->|Load| E
    end

    subgraph ADK_Core [Google ADK Core]
        E -->|Init| R[ADK Runner]
        R -->|State| S[DatabaseSessionService]
        
        subgraph Agent_Swarm [Agentic Swarm]
            A1[Performance Agent]
            A2[Risk Agent]
            A3[Reasoning Agent]
        end
        
        R --> A1 --> R
        R --> A2 --> R
        R --> A3 --> R
    end

    subgraph Decision_Engine [Logic & Output]
        R -->|Synthesis| D[Deterministic Rules]
        D -->|Verdict| UI[Executive Dashboard]
    end

    style Data_Layer fill:#f9f9f9,stroke:#333
    style ADK_Core fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Decision_Engine fill:#fff3e0,stroke:#ff6f00
```

---

## 🌟 Key Features

*   **Google ADK Orchestration**: Uses the `Runner` and `LlmAgent` patterns for enterprise-grade AI execution.
*   **Multi-Agent Swarm**: Specialized agents for Performance Analysis, Risk Assessment, and Final Strategic Reasoning.
*   **Explainable AI (XAI)**: A transparent 5-step **Logic Pathway** revealing the Agent's specific reasoning process and evidence citations.
*   **Deterministic Guardrails**: Guarantees decision consistency through a Python-based rule engine (RENEW, MONITOR, RENEGOTIATE, TERMINATE) that prevents LLM hallucination in final labels.
*   **API Key Rotation**: Automated failover between multiple keys (`GOOGLE_API_KEY_1`, `_2`) to bypass rate-limits.
*   **Data Residency Compliance**: Strategy for **Oman PDPL** alignment using Azure/Google regional datacenters (e.g., UAE North).

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Orchestration** | **Google ADK** | The core framework for agent management and session persistence. |
| **Intelligence** | **Google Gemini 2.5 Flash** | Primary reasoning engine for high-speed, cost-effective audits. |
| **Backend** | **FastAPI** | High-performance async API Layer. |
| **Frontend** | **React (Vite)** | Modern, high-contrast C-Level dashboard. |
| **Database** | **SQLite + AioSqlite** | ADK-managed session history and conversation state. |

---

## 🏁 Getting Started

### 1. Configuration (.env)
The system supports multiple API keys for high availability. Create a `.env` file in the root:
```env
GOOGLE_API_KEY_1=your_first_key
GOOGLE_API_KEY_2=your_second_key
# The system will automatically rotate if Key 1 hits a 429 Rate Limit.
```

### 2. Backend Setup
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python src/app.py
```

### 3. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```

---

## ⚙️ Logic Framework (Decision Boundaries)

The system enforces the following mandatory recommendation rules based on synthesized scores and risk levels:

| Condition | Recommendation | Description |
| :--- | :--- | :--- |
| **Score >= 85 & Risk <= MED** | **RENEW** | Strong performer with manageable risk. |
| **Score 70-84 & Risk == MED** | **MONITOR** | Decent performance but requires oversight. |
| **Score < 50 or High Risk/Low Score**| **TERMINATE** | Systematic failure or critical risk exposure. |
| **All Other Cases** | **RENEGOTIATE** | Performance/terms need formal correction. |

---

## ⚖️ Compliance & Governance
Designed for the Omani Energy Sector, the **Intelligence Hub** supports strict data handling protocols. Future implementations are geared toward local hosting or **Azure UAE North** to satisfy Oman's **Personal Data Protection Law (PDPL)** regarding data sovereignty.
