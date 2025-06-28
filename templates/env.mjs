// Environment variables configuration
export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  MAILJET_API_KEY: process.env.MAILJET_API_KEY || "",
  MAILJET_SECRET_KEY: process.env.MAILJET_SECRET_KEY || "",
  MAILJET_FROM_EMAIL: process.env.MAILJET_FROM_EMAIL || "",
  MAILJET_FROM_NAME: process.env.MAILJET_FROM_NAME || "Better Auth Kit",
};
