const fs = require("fs-extra");
const path = require("path");

console.log("🧪 Running Template Files Tests...\n");

let errors = [];

// Helper functions
function test(name, fn) {
  try {
    console.log(`  ✓ ${name}`);
    fn();
  } catch (error) {
    console.log(`  ✗ ${name}: ${error.message}`);
    errors.push(`${name}: ${error.message}`);
  }
}

function expect(actual) {
  return {
    toContain: (expected) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected content to contain "${expected}"`);
      }
    },
    toHaveProperty: (prop) => {
      if (!(prop in actual)) {
        throw new Error(`Expected object to have property "${prop}"`);
      }
    },
  };
}

const templatesDir = path.join(__dirname, "..", "templates");

// Tests
test("Auth configuration should be valid", () => {
  const authPath = path.join(templatesDir, "lib", "auth.ts");
  const authContent = fs.readFileSync(authPath, "utf8");

  // Check for Better Auth imports and configuration
  expect(authContent).toContain("import { betterAuth }");
  expect(authContent).toContain("import { drizzleAdapter }");
  expect(authContent).toContain("emailAndPassword:");
  expect(authContent).toContain("requireEmailVerification: false");
  expect(authContent).toContain("emailVerification:");
  expect(authContent).toContain("socialProviders:");
  expect(authContent).toContain("google:");
});

test("Database schema should include all necessary tables", () => {
  const schemaPath = path.join(templatesDir, "lib", "drizzle", "schema.ts");
  const schemaContent = fs.readFileSync(schemaPath, "utf8");

  // Check for required tables
  expect(schemaContent).toContain("export const user");
  expect(schemaContent).toContain("export const session");
  expect(schemaContent).toContain("export const account");
  expect(schemaContent).toContain("export const verification");

  // Check for required fields
  expect(schemaContent).toContain("email");
  expect(schemaContent).toContain("emailVerified");
  expect(schemaContent).toContain("token");
  expect(schemaContent).toContain("userId");
});

test("Drizzle config should use correct environment setup", () => {
  const configPath = path.join(templatesDir, "drizzle.config.ts");
  const configContent = fs.readFileSync(configPath, "utf8");

  expect(configContent).toContain('import { config } from "dotenv"');
  expect(configContent).toContain('config({ path: ".env.local" })');
  expect(configContent).toContain('schema: "./src/lib/drizzle/schema.ts"');
  expect(configContent).toContain('dialect: "postgresql"');
  expect(configContent).toContain("process.env.DATABASE_URL!");
});

test("Middleware should protect dashboard routes", () => {
  const middlewarePath = path.join(templatesDir, "middleware.ts");
  const middlewareContent = fs.readFileSync(middlewarePath, "utf8");

  expect(middlewareContent).toContain("NextRequest");
  expect(middlewareContent).toContain("/dashboard");
  expect(middlewareContent).toContain("/auth/signin");
  expect(middlewareContent).toContain("protectedRoutes");
  expect(middlewareContent).toContain("export const config");
});

test("Environment file should have all required variables", () => {
  const envPath = path.join(templatesDir, "env.mjs");
  const envContent = fs.readFileSync(envPath, "utf8");

  expect(envContent).toContain("DATABASE_URL");
  expect(envContent).toContain("BETTER_AUTH_SECRET");
  expect(envContent).toContain("BETTER_AUTH_URL");
  expect(envContent).toContain("GOOGLE_CLIENT_ID");
  expect(envContent).toContain("MAILJET_API_KEY");
  expect(envContent).toContain("MAILJET_SECRET_KEY");
  expect(envContent).toContain("MAILJET_FROM_EMAIL");
});

test("Signup page should implement correct flow", () => {
  const signupPath = path.join(
    templatesDir,
    "app",
    "auth",
    "signup",
    "page.tsx"
  );
  const signupContent = fs.readFileSync(signupPath, "utf8");

  expect(signupContent).toContain("signUp.email");
  expect(signupContent).toContain('router.push("/dashboard")');
  expect(signupContent).toContain("useState");
  expect(signupContent).toContain("signup");
});

test("Dashboard profile page should handle email verification", () => {
  const profilePath = path.join(
    templatesDir,
    "app",
    "dashboard",
    "profile",
    "page.tsx"
  );
  const profileContent = fs.readFileSync(profilePath, "utf8");

  expect(profileContent).toContain("sendVerificationEmail");
  expect(profileContent).toContain("emailVerified");
  expect(profileContent).toContain("verification");
  expect(profileContent).toContain("useSession");
});

// Report results
console.log(`\n📊 Template Tests Summary:`);
console.log(`   Passed: ${7 - errors.length}/7`);
if (errors.length > 0) {
  console.log(`   Failed: ${errors.length}/7`);
  console.log("\n❌ Failed tests:");
  errors.forEach((error) => console.log(`   • ${error}`));
  process.exit(1);
} else {
  console.log("   ✅ All template tests passed!");
}
