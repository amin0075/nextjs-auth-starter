const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

console.log("🧪 Running Package Setup Tests...\n");

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
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toContain: (expected) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
    toHaveProperty: (prop) => {
      if (!(prop in actual)) {
        throw new Error(`Expected object to have property "${prop}"`);
      }
    },
  };
}

// Tests
test("CLI should exist and be executable", () => {
  const cliPath = path.join(__dirname, "..", "bin", "cli.js");
  expect(fs.existsSync(cliPath)).toBe(true);

  // Test CLI help command
  const result = execSync(`node ${cliPath} --help`, { encoding: "utf8" });
  expect(result).toContain("nextjs-auth-starter");
  expect(result).toContain("init");
});

test("Template files should exist", () => {
  const templatesDir = path.join(__dirname, "..", "templates");
  const requiredFiles = [
    "app/auth/signin/page.tsx",
    "app/auth/signup/page.tsx",
    "app/dashboard/page.tsx",
    "app/dashboard/profile/page.tsx",
    "components/ui/button.tsx",
    "lib/auth.ts",
    "lib/auth-client.ts",
    "lib/db.ts",
    "lib/drizzle/schema.ts",
    "drizzle.config.ts",
    "middleware.ts",
    "env.mjs",
    "tailwind.config.js",
    "components.json",
    "dependencies.json",
  ];

  requiredFiles.forEach((file) => {
    const filePath = path.join(templatesDir, file);
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

test("Dependencies.json should have all required packages", () => {
  const depsPath = path.join(__dirname, "..", "templates", "dependencies.json");
  const deps = JSON.parse(fs.readFileSync(depsPath, "utf8"));

  // Check runtime dependencies
  expect(deps.dependencies).toHaveProperty("better-auth");
  expect(deps.dependencies).toHaveProperty("drizzle-orm");
  expect(deps.dependencies).toHaveProperty("@neondatabase/serverless");
  expect(deps.dependencies).toHaveProperty("zod");
  expect(deps.dependencies).toHaveProperty("dotenv");

  // Check dev dependencies
  expect(deps.devDependencies).toHaveProperty("drizzle-kit");
  expect(deps.devDependencies).toHaveProperty("@types/node");
});

test("Package.json should have correct scripts configuration", () => {
  const packagePath = path.join(__dirname, "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  expect(packageJson.scripts).toHaveProperty("build");
  expect(packageJson.scripts).toHaveProperty("test");
  expect(packageJson.scripts).toHaveProperty("db:generate");
  expect(packageJson.scripts).toHaveProperty("db:push");
  expect(packageJson.scripts).toHaveProperty("db:studio");
});

test("Package.json should have correct metadata", () => {
  const packagePath = path.join(__dirname, "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  expect(packageJson.name).toBe("nextjs-auth-starter");
  expect(packageJson.main).toBe("dist/index.js");
  expect(packageJson.bin).toHaveProperty("nextjs-auth-starter");
  expect(packageJson.files).toContain("templates");
  expect(packageJson.files).toContain("bin");
});

// Report results
console.log(`\n📊 Setup Tests Summary:`);
console.log(`   Passed: ${5 - errors.length}/5`);
if (errors.length > 0) {
  console.log(`   Failed: ${errors.length}/5`);
  console.log("\n❌ Failed tests:");
  errors.forEach((error) => console.log(`   • ${error}`));
  process.exit(1);
} else {
  console.log("   ✅ All setup tests passed!");
}
