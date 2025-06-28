import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./drizzle/schema";
import { mailjetService } from "./mailjet";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Allow immediate access after signup
    autoSignInAfterVerification: true, // Auto sign-in after email verification
    sendResetPassword: async (data: any, request: any) => {
      // Extract user and url from the data object
      const { user, url } = data;

      if (!user?.email) {
        console.error(
          "Better Auth: No email found in user object for password reset"
        );
        return;
      }

      await mailjetService.sendPasswordResetEmail(user.email, url);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailVerification: {
    sendOnSignUp: true, // Send verification email but don't block access
    autoSignInAfterVerification: true,
    sendVerificationEmail: async (data: any, request: any) => {
      // Extract user and url from the data object
      const { user, url } = data;

      if (!user?.email) {
        console.error("Better Auth: No email found in user object");
        return;
      }

      await mailjetService.sendVerificationEmail(user.email, url);
    },
  },
});
