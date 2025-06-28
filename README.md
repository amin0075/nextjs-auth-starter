# Next.js Auth ## Features

- 🔐 Email/Password authentication with secure login/signup
- ⚡ **Immediate dashboard access** after signup (no verification required)
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

## 📦 Installation

```bash
npm install nextjs-auth-starter
```

**Or install and initialize in one command:**
```bash
npx nextjs-auth-starter init
```

🔗 **npm Package**: [nextjs-auth-starter](https://www.npmjs.com/package/nextjs-auth-starter)m version](https://badge.fury.io/js/nextjs-auth-starter.svg)](https://badge.fury.io/js/nextjs-auth-starter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/nextjs-auth-starter.svg)](https://www.npmjs.com/package/nextjs-auth-starter)
[![npm](https://img.shields.io/npm/v/nextjs-auth-starter.svg)](https://www.npmjs.com/package/nextjs-auth-starter)

> **⚠️ CRITICAL REQUIREMENTS:**
> - Your Next.js project **MUST use the `src/` directory structure**
> - Install this package **at the start of your project** (it overwrites configuration files)
> - Ensure you have `src/app/` directory before installation
> - **MUST complete ALL environment variables** (database, API keys, secrets)

A complete, production-ready authentication solution for Next.js applications using Better Auth, featuring email/password authentication, Google OAuth, email verification, password reset, and protected dashboard routes with modern UI components.

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

## 🔧 Environment Setup Guide

### Database Setup (NeonDB Recommended)

1. **Create Account**: Go to [NeonDB](https://neon.tech) and create a free account
2. **Create Project**: Create a new project and database
3. **Get Connection String**: Copy the connection string from your dashboard
4. **Add to Environment**: Add it to `.env.local` as `DATABASE_URL`

### Mailjet Email Setup (Required)

1. **Create Account**: Go to [Mailjet](https://www.mailjet.com) and create a free account
2. **Get API Keys**: Get your API Key and Secret Key from the dashboard
3. **Verify Sender**: Verify a sender domain or email address
4. **Add to Environment**: Add credentials to `.env.local`

### Google OAuth Setup (Optional)

1. **Google Cloud Console**: Go to [Google Cloud Console](https://console.cloud.google.com)
2. **Create Project**: Create a new project or select existing one
3. **Enable APIs**: Enable Google+ API and Google OAuth2 API
4. **Create Credentials**: Create OAuth 2.0 credentials
5. **Configure Domains**: Add your domain to authorized origins and redirect URIs
6. **Add to Environment**: Add credentials to `.env.local`

### Generate Auth Secret

Generate a secure random string (32+ characters):

```bash
# macOS/Linux
openssl rand -hex 32

# Windows PowerShell
[System.Web.Security.Membership]::GeneratePassword(32, 0)

# Online
# Visit: https://www.uuidgenerator.net/api/version4
```

**Security Note**: Never use the same secret in development and production!

## What's Included

### Authentication Pages

- **Sign In** (`/auth/signin`) - Email/password and Google OAuth
- **Sign Up** (`/auth/signup`) - User registration with immediate dashboard access
- **Forgot Password** (`/auth/forgot-password`) - Password reset functionality

### User Experience Flow

1. **Sign Up** → Immediate access to dashboard (no verification required)
2. **Email Verification** → Optional, can be done from profile page later
3. **Dashboard Access** → Full functionality available immediately
4. **Profile Management** → Email verification status and controls

### Protected Dashboard

- **Dashboard** (`/dashboard`) - Main dashboard page (protected by default)
- **Profile** (`/dashboard/profile`) - User profile with email verification controls

### API Routes

- **Auth Handler** (`/api/auth/[...all]`) - Better Auth API endpoints

### Middleware

- **Route Protection** - Automatically protects `/dashboard/**` routes
- **Session Validation** - Validates user sessions
- **Redirect Logic** - Redirects unauthenticated users to signin

### Database Schema

- **Users** - User account information
- **Sessions** - User session management
- **Accounts** - OAuth provider accounts
- **Verification** - Email verification tokens

## Configuration

### Database

The package uses Drizzle ORM with PostgreSQL and follows the recommended structure:

```
lib/
├── drizzle/
│   ├── index.ts     # Database connection
│   └── schema.ts    # Database schema
├── db.ts            # Database export
└── auth.ts          # Auth configuration
```

Configure your database connection in the environment variables:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

### Email Service (Mailjet)

The package uses Mailjet for sending verification and password reset emails. To set up Mailjet:

1. Go to [Mailjet](https://www.mailjet.com/) and create an account
2. Get your API Key and Secret Key from the dashboard
3. Add a verified sender domain/email
4. Add the credentials to your `.env.local`:

```env
MAILJET_API_KEY="your-api-key"
MAILJET_SECRET_KEY="your-secret-key"
MAILJET_FROM_EMAIL="noreply@yourdomain.com"
MAILJET_FROM_NAME="Your App Name"
```

### Google OAuth

To enable Google OAuth, set up a Google Cloud Console project and add the credentials:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Route Protection

By default, all routes under `/dashboard/**` are protected. You can modify the protected routes in `middleware.ts`:

```typescript
const protectedRoutes = ["/dashboard", "/admin", "/profile"];
```

## Available Scripts

The package adds the following npm scripts to your project for database management:

```bash
# Database Schema Generation
npm run db:generate    # Generate migration files from schema changes

# Database Migration
npm run db:push        # Push schema changes directly to database

# Database Studio
npm run db:studio      # Open Drizzle Studio (web-based database browser)
```

### When to use each command:

- **`npm run db:generate`**: Use this when you make changes to your database schema in `src/lib/drizzle/schema.ts`. It creates migration files that track your schema changes.

- **`npm run db:push`**: Use this to directly push your schema changes to the database. Great for development, but use migrations for production.

- **`npm run db:studio`**: Use this to visually browse and edit your database data through a web interface. Very helpful for debugging and data management.

## Customization

### Styling

The package uses Tailwind CSS and shadcn/ui components. You can customize the theme by modifying:

- `tailwind.config.js` - Tailwind configuration
- `app/globals.css` - Global styles and CSS variables

### Authentication Logic

Modify the authentication behavior in:

- `lib/auth.ts` - Better Auth configuration
- `lib/auth-client.ts` - Client-side authentication methods

### Database Schema

Extend the database schema in:

- `lib/schema.ts` - Drizzle schema definitions
- `drizzle.config.ts` - Drizzle configuration

## Development

### Building the Package

```bash
npm run build
```

### Publishing

```bash
npm publish
```

## Requirements

- Next.js 14+ (App Router)
- React 18+
- Node.js 18+
- PostgreSQL database (NeonDB recommended)

## Dependencies

### Runtime Dependencies

- `better-auth` - Authentication library
- `drizzle-orm` - Database ORM
- `@neondatabase/serverless` - NeonDB adapter
- `zod` - Schema validation
- `@radix-ui/react-*` - UI primitives
- `class-variance-authority` - CSS utility
- `clsx` & `tailwind-merge` - CSS class utilities
- `lucide-react` - Icons

### Development Dependencies

- `drizzle-kit` - Database migration tool
- `typescript` - TypeScript compiler
- `tailwindcss` - CSS framework

## License

MIT

## Support

For issues and questions, please create an issue on the GitHub repository.
