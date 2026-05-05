# 🏢 Business Hub

> Earn money by training AI and digital creations.

A full-stack Next.js application with authentication, assessment flow, task management, and Paystack payment integration — deployable on Vercel.

---

## 🚀 Quick Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/business-hub.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Add Environment Variables (see below)
4. Click **Deploy**

---

## 🔐 Environment Variables

Set these in Vercel → Project Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | A long random string (e.g. generate with `openssl rand -base64 32`) |
| `PAYSTACK_SECRET_KEY` | From Paystack Dashboard → Settings → API Keys |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Your Paystack public key |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g. `https://business-hub.vercel.app`) |

### Getting Paystack Keys
1. Sign up at [paystack.com](https://paystack.com)
2. Go to Settings → API Keys & Webhooks
3. Copy your **Secret Key** and **Public Key**
4. Enable M-Pesa in Settings → Payment Channels

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── page.module.css       # Landing styles
│   ├── auth/
│   │   ├── signup/           # Signup page + CSS
│   │   └── login/            # Login page
│   ├── assessment/           # 5-question quiz + CSS
│   ├── results/              # Score results + CSS
│   ├── bonus/                # Welcome bonus + CSS
│   ├── dashboard/            # Main dashboard + CSS
│   ├── upgrade/              # Pricing packages + CSS
│   ├── payment/              # Paystack checkout + CSS
│   └── api/
│       ├── auth/signup/      # POST signup
│       ├── auth/login/       # POST login
│       ├── tasks/            # GET tasks
│       ├── submit-task/      # POST submit
│       ├── pay/              # POST init payment, GET verify
│       └── user/             # GET/PATCH user profile
├── lib/
│   ├── store.ts              # In-memory data store
│   ├── auth.ts               # JWT utilities
│   └── questions.ts          # Assessment questions
```

---

## 🗄️ Production Database

The app uses in-memory storage by default (fine for demo/testing). For production:

**Recommended: Supabase (Free tier)**
1. Create a project at [supabase.com](https://supabase.com)
2. Create tables: `users`, `tasks`, `completed_tasks`
3. Replace `src/lib/store.ts` with Supabase client calls

**Or: PlanetScale / Neon / Vercel KV**

---

## 💳 Payment Flow

1. User selects package → `/upgrade`
2. Clicks package → `/payment?package=beginner`
3. Enters email → POST `/api/pay`
4. **With Paystack keys**: Redirects to Paystack hosted page
5. **Demo mode** (no keys): Instantly simulates payment success
6. On success: Account tier upgraded, all tasks unlocked

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens stored in httpOnly cookies
- All sensitive routes check auth middleware
- Paystack webhook verification recommended for production

---

## 📱 Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Landing page with CTA |
| `/auth/signup` | Register new account |
| `/auth/login` | Sign in |
| `/assessment` | 5-question AI assessment |
| `/results` | Assessment score + pass/fail |
| `/bonus` | KSh 100 welcome bonus |
| `/dashboard` | Task list + balance + withdraw |
| `/upgrade` | Pricing packages |
| `/payment` | Paystack checkout |

---

## 🎨 Design System

Each page has its own unique CSS module with distinct aesthetics:
- **Landing**: Dark emerald & gold editorial
- **Auth**: Clean light monochrome  
- **Assessment**: Deep purple focused quiz
- **Results**: Celebratory dark blue
- **Bonus**: Warm golden reward
- **Dashboard**: GitHub-inspired dark workspace
- **Upgrade**: Premium pricing cards
- **Payment**: Trust-focused minimal light

---

Built with Next.js 14, App Router, TypeScript, and Paystack.
