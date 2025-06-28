import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Load environment variables
config({ path: ".env.local" });

export default {
  schema: "./src/lib/drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
