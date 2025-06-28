const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

console.log("🧪 Running CLI Integration Tests...\n");

let errors = [];
let testDir;

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

// Setup test environment
testDir = path.join(os.tmpdir(), `nextjs-auth-test-${Date.now()}`);
fs.ensureDirSync(testDir);

// Cleanup function
function cleanup() {
  if (fs.existsSync(testDir)) {
    fs.removeSync(testDir);
  }
}

// Tests
test("CLI should show help information", () => {
  const cliPath = path.join(__dirname, "..", "bin", "cli.js");
  const result = execSync(`node ${cliPath} --help`, { encoding: "utf8" });

  expect(result).toContain("nextjs-auth-starter");
  expect(result).toContain("init");
  expect(result).toContain("Initialize Next.js Auth Starter");
});

test("CLI should validate src directory requirement", () => {
  // Create a test Next.js project without src directory
  const testProject = path.join(testDir, "test-project");
  fs.ensureDirSync(testProject);
  fs.ensureDirSync(path.join(testProject, "app"));

  // Create package.json
  fs.writeFileSync(
    path.join(testProject, "package.json"),
    JSON.stringify({ name: "test-project", scripts: {} }, null, 2)
  );

  const cliPath = path.join(__dirname, "..", "bin", "cli.js");

  // The CLI should still work but show warnings about src structure
  const result = execSync(
    `cd ${testProject} && node ${cliPath} init --no-install`,
    { encoding: "utf8" }
  );
  expect(result).toContain("Auth Starter installed");
});

test("CLI should successfully initialize project with src structure", () => {
  // Create a test Next.js project with src directory
  const testProject = path.join(testDir, "test-project-src");
  fs.ensureDirSync(path.join(testProject, "src", "app"));

  // Create package.json
  fs.writeFileSync(
    path.join(testProject, "package.json"),
    JSON.stringify(
      {
        name: "test-project",
        scripts: {},
        dependencies: {},
        devDependencies: {},
      },
      null,
      2
    )
  );

  const cliPath = path.join(__dirname, "..", "bin", "cli.js");

  // Run CLI init
  const result = execSync(
    `cd ${testProject} && node ${cliPath} init --no-install`,
    { encoding: "utf8" }
  );

  expect(result).toContain("installed successfully");

  // Check that files were created in src structure
  expect(
    fs.existsSync(
      path.join(testProject, "src", "app", "auth", "signin", "page.tsx")
    )
  ).toBe(true);
  expect(
    fs.existsSync(path.join(testProject, "src", "app", "dashboard", "page.tsx"))
  ).toBe(true);
  expect(fs.existsSync(path.join(testProject, "src", "lib", "auth.ts"))).toBe(
    true
  );
  expect(
    fs.existsSync(
      path.join(testProject, "src", "components", "ui", "button.tsx")
    )
  ).toBe(true);
});

test("CLI should add database scripts to package.json", () => {
  // Create a test project
  const testProject = path.join(testDir, "test-scripts");
  fs.ensureDirSync(path.join(testProject, "src", "app"));

  const packageJsonPath = path.join(testProject, "package.json");
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      {
        name: "test-project",
        scripts: { dev: "next dev" },
        dependencies: {},
        devDependencies: {},
      },
      null,
      2
    )
  );

  const cliPath = path.join(__dirname, "..", "bin", "cli.js");

  // Run CLI init
  execSync(`cd ${testProject} && node ${cliPath} init --no-install`, {
    encoding: "utf8",
  });

  // Check package.json was updated with scripts
  const updatedPackageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf8")
  );
  expect(updatedPackageJson.scripts).toHaveProperty("db:generate");
  expect(updatedPackageJson.scripts).toHaveProperty("db:push");
  expect(updatedPackageJson.scripts).toHaveProperty("db:studio");

  // Original script should be preserved
  expect(updatedPackageJson.scripts).toHaveProperty("dev");
});

test("CLI should create environment file", () => {
  // Create a test project
  const testProject = path.join(testDir, "test-env");
  fs.ensureDirSync(path.join(testProject, "src", "app"));

  fs.writeFileSync(
    path.join(testProject, "package.json"),
    JSON.stringify(
      {
        name: "test-project",
        scripts: {},
        dependencies: {},
        devDependencies: {},
      },
      null,
      2
    )
  );

  const cliPath = path.join(__dirname, "..", "bin", "cli.js");

  // Run CLI init
  execSync(`cd ${testProject} && node ${cliPath} init --no-install`, {
    encoding: "utf8",
  });

  // Check .env.example was created
  const envExamplePath = path.join(testProject, ".env.example");
  expect(fs.existsSync(envExamplePath)).toBe(true);

  const envContent = fs.readFileSync(envExamplePath, "utf8");
  expect(envContent).toContain("DATABASE_URL");
  expect(envContent).toContain("BETTER_AUTH_SECRET");
  expect(envContent).toContain("MAILJET_API_KEY");
});

// Cleanup and report results
cleanup();

console.log(`\n📊 CLI Tests Summary:`);
console.log(`   Passed: ${5 - errors.length}/5`);
if (errors.length > 0) {
  console.log(`   Failed: ${errors.length}/5`);
  console.log("\n❌ Failed tests:");
  errors.forEach((error) => console.log(`   • ${error}`));
  process.exit(1);
} else {
  console.log("   ✅ All CLI tests passed!");
}
