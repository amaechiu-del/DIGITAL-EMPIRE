# Digital Empire | DOMISLINK INTERNATIONAL

Nigeria's premier digital marketplace for courses, training programs, software, and digital products.

## Features

- 🛒 **Full Shopping Cart** — Add, update, remove items; persistent via localStorage
- 🔐 **Firebase Authentication** — Email/password & Google sign-in
- 💳 **Paystack Payments** — Inline payment with Naira (NGN) support
- 📦 **4 Product Categories** — Courses, Training, Software, Digital Products
- 📱 **Fully Responsive** — Mobile-first design with Tailwind CSS
- ⚡ **Next.js 14 App Router** — Server & client components, static generation
- 🔍 **Filtering & Search** — Category, price range, keyword, and sort filters

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn-style UI components
- **Auth & DB**: Firebase (Auth + Firestore + Storage)
- **Payments**: Paystack
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
# Fill in Firebase and Paystack credentials
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/          - Next.js App Router pages
components/   - UI, layout, product, cart components
context/      - CartContext & AuthContext
hooks/        - useCart & useAuth
lib/          - Firebase, Paystack, utils, product data
types/        - TypeScript type definitions
```

© 2024 DOMISLINK INTERNATIONAL. All rights reserved.
