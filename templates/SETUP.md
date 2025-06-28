# Better Auth Kit Setup

This script helps you set up Better Auth Kit in your Next.js project.

> **⚠️ IMPORTANT:** This package configures Tailwind CSS, shadcn/ui, and global styles. It will override existing configuration files including `tailwind.config.js`, `globals.css`, `components.json`, and `postcss.config.js`. Please backup your custom configurations before installation if you need to preserve them.

## Prerequisites

- Node.js 18+
- A Next.js 14+ project (App Router)
- A PostgreSQL database (NeonDB recommended)

## Quick Setup

1. **Install Better Auth Kit**

   ```bash
   npm install better-auth-kit
   ```

2. **Initialize in your project**

   ```bash
   npx better-auth-kit init
   ```

## Configuration Files Installed

The initialization process will create/update the following configuration files:

- **`tailwind.config.js`** - Updated with shadcn/ui theme configuration and CSS variables
- **`src/app/globals.css`** - Global styles with Tailwind CSS imports and CSS variable definitions
- **`components.json`** - shadcn/ui configuration for component installation
- **`postcss.config.js`** - PostCSS configuration for Tailwind CSS processing
- **`tsconfig.json`** - TypeScript configuration with proper path mappings for src/ structure

These files follow the latest shadcn/ui guidelines and modern Tailwind CSS best practices.

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your values: ```env

   # Database - Get this from your NeonDB dashboard

   DATABASE_URL="postgresql://username:password@host/database"

   # Better Auth - Generate a random secret

   BETTER_AUTH_SECRET="your-32-character-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

   # Google OAuth (optional)

   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Mailjet Email Service (required for email verification and password reset)

   MAILJET_API_KEY="your-mailjet-api-key"
   MAILJET_SECRET_KEY="your-mailjet-secret-key"
   MAILJET_FROM_EMAIL="noreply@yourdomain.com"
   MAILJET_FROM_NAME="Your App Name"

   ```

   ```

4. **Generate database schema**

   ```bash
   npx @better-auth/cli generate
   ```

5. **Push schema to database**

   ```bash
   npx drizzle-kit push:pg
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## What's Included

### Pages

- `/` - Landing page with authentication options
- `/auth/signin` - Sign in page with email/password and Google OAuth
- `/auth/signup` - Sign up page with email verification
- `/auth/forgot-password` - Password reset page
- `/dashboard` - Protected dashboard (requires authentication)
- `/dashboard/profile` - User profile with email verification

### API Routes

- `/api/auth/[...all]` - Better Auth API endpoints

### Middleware

- Route protection for `/dashboard/**` paths
- Session validation
- Automatic redirects for unauthenticated users

## Database Setup

### Using NeonDB (Recommended)

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env.local` file

### Database Structure

The package uses a modern Drizzle ORM structure:

```
lib/
├── drizzle/
│   ├── index.ts     # Database connection using Neon
│   └── schema.ts    # PostgreSQL schema definitions
├── db.ts            # Database export
├── auth.ts          # Better Auth configuration
└── mailjet.ts       # Email service configuration
```

### Using other PostgreSQL providers

You can use any PostgreSQL database. Just update the `DATABASE_URL` in your `.env.local` file.

## Email Setup (Mailjet)

The package uses Mailjet for sending verification and password reset emails.

### Setting up Mailjet

1. Go to [Mailjet](https://www.mailjet.com/) and create an account
2. Navigate to Account Settings > API Key Management
3. Get your API Key and Secret Key
4. Add a verified sender domain or email address
5. Add the credentials to your `.env.local` file

### Email Templates

The package includes beautiful HTML email templates for:

- Email verification
- Password reset
- Custom notifications

You can customize these templates in `lib/mailjet.ts`.

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Add your callback URL: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to your `.env.local`

## Customization

### Styling

- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Components use shadcn/ui - customize in `components/ui/`

### Authentication Configuration

- Modify `lib/auth.ts` for Better Auth settings
- Update `middleware.ts` for route protection rules
- Customize `lib/auth-client.ts` for client-side behavior

### Database Schema

- Extend schema in `lib/schema.ts`
- Use Drizzle Kit commands for database management:
  - `npm run db:generate` - Generate migration files
  - `npm run db:push` - Push schema changes to database
  - `npm run db:studio` - Open Drizzle Studio
- Update `drizzle.config.ts` for database settings

## Troubleshooting

### Common Issues

1. **Module not found errors**

   - Make sure all dependencies are installed: `npm install`
   - Check that paths in `tsconfig.json` are correct

2. **Database connection errors**

   - Verify your `DATABASE_URL` is correct
   - Make sure your database is accessible
   - Check firewall settings for cloud databases

3. **Authentication not working**

   - Verify `BETTER_AUTH_SECRET` is set
   - Check that `BETTER_AUTH_URL` matches your domain
   - Ensure database schema is up to date

4. **Google OAuth issues**
   - Verify client ID and secret are correct
   - Check authorized origins in Google Console
   - Ensure callback URL is properly configured

### Getting Help

- Check the [Better Auth documentation](https://better-auth.com/docs)
- Open an issue on the GitHub repository
- Review the examples in the `templates/` directory

## Next Steps

After setup, you can:

1. Customize the UI components in `components/ui/`
2. Add more authentication providers
3. Extend the user profile functionality
4. Add role-based access control
5. Implement email notifications
6. Add two-factor authentication

Enjoy building with Better Auth Kit! 🚀
