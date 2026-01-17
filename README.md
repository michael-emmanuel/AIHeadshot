# AIHeadshot

Turn ordinary photos into polished professional headshots using AI.

This repository contains a web application built with **Next.js + TypeScript + Tailwind CSS** that generates AI headshots from user uploads.

---

## 🚀 Features

- Upload one or more photos
- Generate professional headshot images with AI
- Preview & download results
- Responsive UI built with Tailwind
- Designed to integrate with AI image generation APIs (OpenAI, Replicate, etc.)

> This project focuses on the frontend and workflow. You must integrate an AI backend or API to generate headshots.

---

## 🧠 Tech Stack

- **Next.js** — React framework with SSR/SSG
- **TypeScript** — Static typing
- **Tailwind CSS** — Utility-first styling
- **Supabase** — File storage and authentication
- **API Routes** — Serverless endpoints for AI calls
- **Resend** - Deliver emails at scale

---

## 📥 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/michael-emmanuel/AIHeadshot.git
cd AIHeadshot
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Configure environment variables

- Create a .env.local file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
AI_MODEL_API_KEY=your_api_key_here
```

### 4. Development

- Start the development server:

```bash
npm run dev
```

### 5. Production

- Build and start the production server:

```bash
npm run build
npm start
```

### AI Integration

#### This project expects API routes to connect to an AI image generation service

- Replicate (Stable Diffusion / DreamBooth)
- Custom fine-tuned diffusion models
