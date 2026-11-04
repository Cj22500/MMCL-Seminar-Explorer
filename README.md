# MMCL Seminar Explorer - AI-Powered Tech & CS Event Discovery Platform

A full-stack seminar and developer conference discovery application built for Computer Science students at Mapua Malayan Colleges Laguna (MMCL), powered by **React 19**, **TypeScript**, **Tailwind CSS v4**, **Node.js / Express (`server.ts`)**, and the **Google Gemini API (`@google/genai`)**.

## Key Features
- **AI-Powered Seminar Discovery & Grounded Search (`server.ts`)**: Uses the Google Gemini API (`@google/genai`) with structured JSON schema output (`Type.OBJECT` / `Type.ARRAY`) to discover, categorize, and summarize local (Philippine) and international Computer Science conferences, hackathons, and workshops.
- **Curated Fallback & Resilience**: Built-in curated seminar dataset (e.g., DEVCON Summit Philippines, PyCon PH, Google I/O Extended) with automatic graceful fallback when offline or rate-limited.
- **Interactive Filtering & Topic Tagging**: Filter events by modality (`onsite`, `online`, `hybrid`), scale (`local`, `international`), and technical domain (`AI`, `Cloud Native`, `Cybersecurity`, `Web/Mobile`).

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite, Motion, Lucide React
- **Backend**: Node.js, Express (`server.ts`), `@google/genai`

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Add your `GEMINI_API_KEY` to `.env.local` (or run without a key to use simulated curated search):
   ```bash
   npm run dev
   ```
