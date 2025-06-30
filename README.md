# Better Auth Kit

[![npm version](https://badge.fury.io/js/nextjs-auth-starter.svg)](https://badge.fury.io/js/nextjs-auth-starter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/nextjs-auth-starter.svg)](https://www.npmjs.com/package/nextjs-auth-starter)

A CLI tool that sets up complete authentication for Next.js projects using [Better Auth](https://www.better-auth.com/) with PostgreSQL and Drizzle ORM.

> **⚡ Quick Start:** `npx nextjs-auth-starter init`

## What you get

- 🔐 Complete auth pages (signin, signup, forgot password, email verification)
- 🗄️ Database schema with Drizzle ORM
- ⚙️ Better Auth configuration with session management
- 🛡️ Route protection middleware
- 📱 Dashboard pages with profile management
- 🔗 Google OAuth integration (optional)
- 📧 Email service with Mailjet integration
- 🎨 Beautiful UI with shadcn/ui components

## 🚀 Setup Guide

### Prerequisites
- Next.js 14+ with App Router
- Must use `src/` directory structure 
- PostgreSQL database
- Node.js 18+

### Step 1: Create Next.js Project

**IMPORTANT: You MUST use the `src/` directory structure:**

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
cd my-app
```

### Step 2: Initialize Authentication

```bash
npx nextjs-auth-starter init
```

This automatically:
- ✅ Installs all required dependencies
- ✅ Creates auth pages in `src/app/auth/`
- ✅ Sets up dashboard in `src/app/dashboard/`
- ✅ Adds UI components to `src/components/`
- ✅ Configures database schema in `src/lib/`
- ✅ Updates config files (Tailwind, PostCSS, etc.)

### Step 3: Environment Setup

Copy `.env.example` to `.env.local` and configure:

```env
# Database (Required)
DATABASE_URL="postgresql://username:password@host:port/database"

# Better Auth (Required)
BETTER_AUTH_SECRET="your-32-character-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Service - Mailjet (Required for email features)
MAILJET_API_KEY="your-mailjet-api-key"
MAILJET_SECRET_KEY="your-mailjet-secret-key"
MAILJET_FROM_EMAIL="noreply@yourdomain.com"
MAILJET_FROM_NAME="Your App Name"
```

### Step 4: Database Setup

```bash
npm run db:generate  # Generate schema files
npm run db:push      # Create database tables
```

### Step 5: Start Development

```bash
npm run dev
```

🎉 **Done!** Visit these routes:
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page  
- `/dashboard` - Protected dashboard

## Service Setup

### Database (NeonDB Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project and database
3. Copy connection string to `.env.local`

### Email Service (Mailjet)
1. Create account at [mailjet.com](https://mailjet.com)
2. Get API key and secret from dashboard
3. Verify your sender email/domain
4. Add credentials to `.env.local`

### Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add your domains to authorized origins
4. Add credentials to `.env.local`

## What's Included

### Pages
- `/auth/signin` - Login page
- `/auth/signup` - Registration page
- `/auth/forgot-password` - Password reset
- `/auth/verify-email` - Email verification
- `/dashboard` - Protected dashboard
- `/dashboard/profile` - User profile management

### Database Schema
- Users, sessions, accounts, and verification tokens tables
- Drizzle ORM integration with type safety

### Middleware
- Automatic route protection for `/dashboard/*`
- Redirects for unauthenticated users

## Available Commands

```bash
npm run db:generate  # Generate migration files
npm run db:push      # Push schema to database
npm run db:studio    # Open database browser
```

## Customization

After setup, you can modify:
- **Database schema**: `src/lib/schema.ts`
- **Auth configuration**: `src/lib/auth.ts`
- **UI components**: `src/components/`
- **Styling**: `tailwind.config.js` and `app/globals.css`

## License

MIT

## Support

For issues and questions, please create an issue on the [GitHub repository](https://github.com/amin0075/nextjs-auth-starter).
