# Next.js Auth Starter

[![npm version](https://badge.fury.io/js/nextjs-auth-starter.svg)](https://badge.fury.io/js/nextjs-auth-starter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/nextjs-auth-starter.svg)](https://www.npmjs.com/package/nextjs-auth-starter)

A basic authentication setup for Next.js using [Better Auth](https://www.better-auth.com/) with PostgreSQL and Drizzle ORM. This package sets up the fundamental auth structure in your project - you can customize everything after installation.

## What you get

- Basic auth pages (signin, signup, forgot password, email verification)
- Database schema with Drizzle ORM
- Better Auth configuration 
- Route protection middleware
- Dashboard pages with profile management
- Google OAuth setup (optional)
- Email service integration with Mailjet
- shadcn/ui components for the UI

## Installation

```bash
npx nextjs-auth-starter init
```

This downloads and runs the package without installing it as a dependency (which you don't need since it just copies files to your project).

## Features

- 🔐 Email/Password authentication with secure login/signup
- � **Immediate dashboard access** after signup (no verification required)
- ✉️ Optional email verification (can be done from profile)
- 🔗 Google OAuth integration
- 🔑 Password reset functionality
- 🛡️ Route protection middleware
- 📱 Responsive UI with shadcn/ui components
- 🗄️ PostgreSQL with Drizzle ORM
- ☁️ NeonDB integration
- 🎨 Beautiful, modern UI components
- 📝 Form validation with Zod
- 📧 Mailjet email service integration

## 🚀 Quick Start

### Step 1: Create Next.js Project with src/ Structure

**IMPORTANT: You MUST create your Next.js project with the `src/` directory structure:**

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
cd my-app
```

**Verify your project structure looks like this:**

```
my-app/
├── src/
│   └── app/
│       ├── layout.tsx
│       └── page.tsx
├── package.json
└── ...
```

### Step 2: Install the Package

```bash
npm install nextjs-auth-starter
```

### Step 3: Initialize Authentication

```bash
npx nextjs-auth-starter init
```

✅ **This automatically:**

- Installs all required dependencies
- Creates authentication pages in `src/app/auth/`
- Sets up dashboard pages in `src/app/dashboard/`
- Adds UI components to `src/components/`
- Configures database schema in `src/lib/`
- Adds database management scripts to your `package.json`
- Overwrites config files (Tailwind, PostCSS, etc.) with latest versions

### Step 4: Configure Environment Variables

**⚠️ CRITICAL**: Copy `.env.example` to `.env.local` and fill in ALL required values:

```env
# 🗄️ Database (Required) - Get from NeonDB, Supabase, or any PostgreSQL provider
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# 🔐 Better Auth Secrets (Required) - Generate strong random strings
BETTER_AUTH_SECRET="your-super-secret-key-minimum-32-characters-long-random-string"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# 🔗 Google OAuth (Optional but recommended)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 📧 Mailjet Email Service (Required for email features)
MAILJET_API_KEY="your-mailjet-api-key"
MAILJET_SECRET_KEY="your-mailjet-secret-key"
MAILJET_FROM_EMAIL="noreply@yourdomain.com"
MAILJET_FROM_NAME="Your App Name"
```

### Step 5: Database Setup

**⚠️ Run these commands in order:**

```bash
# 1. Generate database schema files
npm run db:generate

# 2. Push schema to your database (creates tables)
npm run db:push

# 3. (Optional) Open visual database browser
npm run db:studio
```

### Step 6: Start Development

```bash
npm run dev
```

🎉 **Your authentication system is ready!**

**Visit:**

- `http://localhost:3000/auth/signin` - Sign in page
- `http://localhost:3000/auth/signup` - Sign up page
- `http://localhost:3000/dashboard` - Protected dashboard (requires login)

## Requirements

- Next.js 14+ with App Router
- Must use `src/` directory structure
- PostgreSQL database
- Node.js 18+

## Quick Setup

### 1. Create Next.js project with src structure
```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
cd my-app
```

### 2. Set up your project
```bash
npx nextjs-auth-starter init
```

This copies all the auth files to your project:
- Auth pages in `src/app/auth/`
- Dashboard pages in `src/app/dashboard/`
- Database schema in `src/lib/`
- UI components in `src/components/`
- Configuration files (overwrites some existing ones)

### 3. Set up environment variables
Copy the generated `.env.example` to `.env.local` and fill in:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"

# Better Auth
BETTER_AUTH_SECRET="your-32-char-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret" 

# Email service (Mailjet)
MAILJET_API_KEY="your-mailjet-api-key"
MAILJET_SECRET_KEY="your-mailjet-secret-key"
MAILJET_FROM_EMAIL="noreply@yourdomain.com"
```

### 4. Set up database
```bash
npm run db:push
```

### 5. Start development
```bash
npm run dev
```

Visit `/auth/signin` to see the auth pages.

## Database Setup

### Using NeonDB (Recommended)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project and database
3. Copy the connection string to your `.env.local`

### Using other PostgreSQL providers
Any PostgreSQL database works - Supabase, Railway, PlanetScale, etc.

## Email Setup (Mailjet)

1. Create account at [mailjet.com](https://mailjet.com)
2. Get your API key and secret from the dashboard
3. Add a verified sender email/domain
4. Add credentials to `.env.local`

## Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add your domain to authorized origins
4. Add credentials to `.env.local`

## What's included after setup

### Pages
- `/auth/signin` - Login page
- `/auth/signup` - Registration  
- `/auth/forgot-password` - Password reset
- `/auth/verify-email` - Email verification
- `/dashboard` - Protected dashboard
- `/dashboard/profile` - User profile

### API Routes
- `/api/auth/[...all]` - Better Auth endpoints

### Database Schema
- Users table
- Sessions table  
- Accounts table (for OAuth)
- Verification tokens table

### Middleware
- Protects `/dashboard/*` routes
- Redirects unauthenticated users

## Customization

After installation, you can modify:
- Database schema in `src/lib/schema.ts`
- Auth configuration in `src/lib/auth.ts`
- UI components in `src/components/`
- Styling in `tailwind.config.js` and `app/globals.css`

## Database Commands

```bash
npm run db:generate  # Generate migration files
npm run db:push      # Push schema to database  
npm run db:studio    # Open database browser
```

## License

MIT

## Support

For issues and questions, please create an issue on the GitHub repository.
