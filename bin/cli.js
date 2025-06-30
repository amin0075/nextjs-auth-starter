#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const { Command } = require("commander");
const { execSync } = require("child_process");

// Use dynamic import for ESM modules
let chalk;
async function loadChalk() {
  if (!chalk) {
    chalk = (await import("chalk")).default;
  }
  return chalk;
}

const program = new Command();

program
  .name("nextjs-auth-starter")
  .description("Install Next.js Auth Starter in your Next.js project")
  .version("1.1.4");

program
  .command("init")
  .description("Initialize Next.js Auth Starter in your project")
  .option("-d, --dir <directory>", "Target directory", process.cwd())
  .option("--no-install", "Skip dependency installation")
  .action(async (options) => {
    const chalk = await loadChalk();
    const targetDir = path.resolve(options.dir);
    const templatesDir = path.join(__dirname, "..", "templates");

    console.log(chalk.blue("🚀 Installing Next.js Auth Starter..."));

    try {
      // Check if this is a Next.js project
      const packageJsonPath = path.join(targetDir, "package.json");
      if (!fs.existsSync(packageJsonPath)) {
        console.log(
          chalk.yellow(
            "⚠️  No package.json found. Make sure you are in a Next.js project directory."
          )
        );
        console.log(
          chalk.gray(
            "   If this is a new project, run 'npx create-next-app@latest' first."
          )
        );
      } else {
        // Validate it's a Next.js project
        try {
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf8")
          );
          if (
            !packageJson.dependencies?.next &&
            !packageJson.devDependencies?.next
          ) {
            console.log(
              chalk.yellow(
                "⚠️  This doesn't appear to be a Next.js project. Next.js Auth Starter is designed for Next.js projects."
              )
            );
          }
        } catch (error) {
          console.log(chalk.yellow("⚠️  Could not read package.json"));
        }
      }

      // Detect project structure (always use src directory)
      const hasSrcDir = true;

      // Copy files with src structure
      await copyTemplateFiles(templatesDir, targetDir, hasSrcDir, chalk);

      // Handle dependencies
      if (options.install !== false) {
        await installDependencies(templatesDir, targetDir, chalk);
      }

      // Add database scripts to package.json
      await addDatabaseScripts(targetDir, chalk);

      // Success message
      console.log(
        chalk.green("✅ Next.js Auth Starter installed successfully!")
      );
      console.log(chalk.yellow("\n⚠️  Configuration Files:"));
      console.log(
        chalk.gray(
          "   This package has installed/updated the following configuration files:"
        )
      );
      console.log(
        chalk.gray(
          "   • tailwind.config.js (shadcn/ui configuration) - OVERWRITTEN"
        )
      );
      console.log(
        chalk.gray(
          "   • src/app/globals.css (Tailwind CSS with CSS variables) - OVERWRITTEN"
        )
      );
      console.log(
        chalk.gray(
          "   • components.json (shadcn/ui components configuration) - OVERWRITTEN"
        )
      );
      console.log(
        chalk.gray(
          "   • postcss.config.js/mjs (PostCSS configuration) - OVERWRITTEN"
        )
      );
      console.log(
        chalk.gray(
          "   • drizzle.config.ts (Database configuration) - OVERWRITTEN"
        )
      );
      console.log(
        chalk.gray("   • env.mjs (Environment validation) - OVERWRITTEN")
      );
      console.log(
        chalk.gray(
          "   • middleware.ts (Authentication middleware) - OVERWRITTEN"
        )
      );
      console.log(chalk.yellow("\n📝 Next steps:"));
      if (options.install === false) {
        console.log("1. Install dependencies: npm install --legacy-peer-deps");
      }
      console.log("2. Copy .env.example to .env.local and fill in your values");
      console.log("3. Set up your database and get your connection string");
      console.log("4. Configure your OAuth providers (Google, etc.)");
      console.log("5. Set up Mailjet for email services");
      console.log("6. Generate the database schema: npm run db:generate");
      console.log("7. Push schema to database: npm run db:push");
      console.log("8. (Optional) Open Drizzle Studio: npm run db:studio");
      console.log("9. Run your development server: npm run dev");
      console.log(
        chalk.cyan("\n🎉 Your Next.js authentication system is ready!")
      );
      console.log(chalk.gray("Visit /auth/signin to test the login flow"));
      console.log(
        chalk.blue("\n💡 Database scripts have been added to your package.json")
      );
      console.log(
        chalk.gray(
          "   Use npm run db:generate, db:push, db:studio for database management"
        )
      );

      // Structure-specific advice
      console.log(
        chalk.gray(
          "\n💡 Files have been installed in the src/ directory structure"
        )
      );
      console.log(chalk.gray("   Your auth pages are at: src/app/auth/"));
      console.log(chalk.gray("   Your components are at: src/components/"));
    } catch (error) {
      console.error(
        chalk.red("❌ Error installing Next.js Auth Starter:"),
        error.message
      );
      process.exit(1);
    }
  });

async function copyTemplateFiles(templatesDir, targetDir, hasSrcDir, chalk) {
  console.log(chalk.blue("📄 Copying template files to src/ structure..."));

  // Files that go in root directory regardless of src structure
  const rootFiles = [
    ".env.example",
    "drizzle.config.ts",
    "env.mjs",
    "middleware.ts",
    "postcss.config.js",
    "postcss.config.mjs",
    "tailwind.config.js",
    "components.json",
    "SETUP.md",
  ];

  // Files that should be overwritten to ensure latest configuration
  const rootFilesToOverwrite = [
    "tailwind.config.js",
    "components.json",
    "postcss.config.js",
    "postcss.config.mjs",
    "drizzle.config.ts",
    "env.mjs",
    "middleware.ts",
  ];

  // Copy root files
  console.log(chalk.gray("  📁 Root configuration files:"));
  for (const file of rootFiles) {
    const srcPath = path.join(templatesDir, file);
    const destPath = path.join(targetDir, file);

    if (fs.existsSync(srcPath)) {
      if (fs.existsSync(destPath)) {
        if (rootFilesToOverwrite.includes(file)) {
          await fs.copy(srcPath, destPath, { overwrite: true });
          console.log(
            chalk.green(`     ✓ ${file} (overwritten with latest version)`)
          );
        } else {
          console.log(
            chalk.yellow(`     ⚠️  ${file} (already exists, skipped)`)
          );
        }
      } else {
        await fs.copy(srcPath, destPath, { overwrite: false });
        console.log(chalk.gray(`     ✓ ${file}`));
      }
    }
  }

  // Copy the tsconfig.json for src structure
  const tsconfigSrc = path.join(templatesDir, "tsconfig.src.json");
  const tsconfigDest = path.join(targetDir, "tsconfig.json");

  if (fs.existsSync(tsconfigSrc)) {
    if (fs.existsSync(tsconfigDest)) {
      console.log(
        chalk.yellow(`     ⚠️  tsconfig.json (already exists, skipped)`)
      );
    } else {
      await fs.copy(tsconfigSrc, tsconfigDest);
      console.log(chalk.gray(`     ✓ tsconfig.json (src structure)`));
    }
  }

  // Determine base directory for app-related files (always src)
  const baseDir = path.join(targetDir, "src");
  const baseDirDisplay = "src/";

  // Ensure src directory exists
  await fs.ensureDir(baseDir);

  console.log(chalk.gray(`  📁 ${baseDirDisplay}application files:`));

  // Copy app directory
  const appSrcDir = path.join(templatesDir, "app");
  const appDestDir = path.join(baseDir, "app");
  if (fs.existsSync(appSrcDir)) {
    if (fs.existsSync(appDestDir)) {
      console.log(
        chalk.yellow(
          `     ⚠️  ${baseDirDisplay}app/ (directory already exists, merging files)`
        )
      );

      // Handle specific files that should be overwritten
      const filesToOverwrite = ["globals.css"]; // Add more files here if needed: 'layout.tsx', 'page.tsx'
      const existingFiles = [];

      // First pass: copy all files except those that need overwriting
      await fs.copy(appSrcDir, appDestDir, {
        overwrite: false,
        filter: (src, dest) => {
          const fileName = path.basename(src);
          if (filesToOverwrite.includes(fileName)) {
            existingFiles.push({ src, dest, fileName });
            return false; // Skip this file for now
          }
          return true;
        },
      });

      // Second pass: overwrite specific files
      for (const { src, dest, fileName } of existingFiles) {
        await fs.copy(src, dest, { overwrite: true });
        const relativePath = path.relative(targetDir, dest);
        console.log(
          chalk.green(`     ✓ Overwritten ${relativePath} with updated version`)
        );
      }
    } else {
      await fs.copy(appSrcDir, appDestDir, { overwrite: false });
      console.log(chalk.gray(`     ✓ ${baseDirDisplay}app/ directory`));
    }
  }

  // Copy components directory
  const componentsSrcDir = path.join(templatesDir, "components");
  const componentsDestDir = path.join(baseDir, "components");
  if (fs.existsSync(componentsSrcDir)) {
    if (fs.existsSync(componentsDestDir)) {
      console.log(
        chalk.yellow(
          `     ⚠️  ${baseDirDisplay}components/ (directory already exists, merging files)`
        )
      );
      await fs.copy(componentsSrcDir, componentsDestDir, { overwrite: false });
    } else {
      await fs.copy(componentsSrcDir, componentsDestDir, { overwrite: false });
      console.log(chalk.gray(`     ✓ ${baseDirDisplay}components/ directory`));
    }
  }

  // Copy lib directory
  const libSrcDir = path.join(templatesDir, "lib");
  const libDestDir = path.join(baseDir, "lib");
  if (fs.existsSync(libSrcDir)) {
    if (fs.existsSync(libDestDir)) {
      console.log(
        chalk.yellow(
          `     ⚠️  ${baseDirDisplay}lib/ (directory already exists, merging files)`
        )
      );
      await fs.copy(libSrcDir, libDestDir, { overwrite: false });
    } else {
      await fs.copy(libSrcDir, libDestDir, { overwrite: false });
      console.log(chalk.gray(`     ✓ ${baseDirDisplay}lib/ directory`));
    }
  }

  console.log(
    chalk.green(
      `✅ Files copied successfully to ${hasSrcDir ? "src/" : "root"} structure`
    )
  );

  // Fix import paths after copying
  await fixImportPaths(targetDir, hasSrcDir, chalk);

  // Fix Tailwind CSS imports for compatibility
  await fixTailwindImports(targetDir, hasSrcDir, chalk);
}

async function installDependencies(templatesDir, targetDir, chalk) {
  console.log(chalk.blue("📦 Installing dependencies..."));

  const depsPath = path.join(templatesDir, "dependencies.json");
  if (!fs.existsSync(depsPath)) {
    console.log(
      chalk.yellow(
        "⚠️  dependencies.json not found, skipping dependency installation"
      )
    );
    return;
  }

  const deps = JSON.parse(fs.readFileSync(depsPath, "utf8"));

  // Install runtime dependencies
  if (deps.dependencies) {
    const depsList = Object.entries(deps.dependencies)
      .map(([name, version]) => `${name}@${version}`)
      .join(" ");

    console.log(
      chalk.gray(`Installing: ${Object.keys(deps.dependencies).join(", ")}`)
    );
    execSync(`npm install ${depsList} --legacy-peer-deps`, {
      cwd: targetDir,
      stdio: "inherit",
    });
  }

  // Install dev dependencies
  if (deps.devDependencies) {
    const devDepsList = Object.entries(deps.devDependencies)
      .map(([name, version]) => `${name}@${version}`)
      .join(" ");

    console.log(
      chalk.gray(
        `Installing dev dependencies: ${Object.keys(deps.devDependencies).join(
          ", "
        )}`
      )
    );
    execSync(`npm install --save-dev ${devDepsList} --legacy-peer-deps`, {
      cwd: targetDir,
      stdio: "inherit",
    });
  }
}

async function fixImportPaths(targetDir, hasSrcDir, chalk) {
  console.log(
    chalk.gray(
      `  🔧 Fixing import paths for ${hasSrcDir ? "src/" : "root"} structure...`
    )
  );

  if (hasSrcDir) {
    // For src structure, we need to update imports to point to root-level env.mjs
    const filesToFix = [
      path.join(targetDir, "src/lib/mailjet.ts"),
      path.join(targetDir, "src/lib/drizzle/index.ts"),
    ];

    for (const filePath of filesToFix) {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, "utf8");

        if (filePath.includes("mailjet.ts")) {
          // Fix mailjet.ts import: ../env.mjs -> ../../env.mjs
          content = content.replace(
            'import { env } from "../env.mjs";',
            'import { env } from "../../env.mjs";'
          );
        }

        if (filePath.includes("drizzle/index.ts")) {
          // Fix drizzle/index.ts import: ../../env.mjs -> ../../../env.mjs
          content = content.replace(
            'import { env } from "../../env.mjs";',
            'import { env } from "../../../env.mjs";'
          );
        }

        fs.writeFileSync(filePath, content);
        console.log(
          chalk.gray(
            `     ✓ Fixed imports in ${path.relative(targetDir, filePath)}`
          )
        );
      }
    }
  }
  // For root structure, the default imports are already correct
}

async function fixTailwindImports(targetDir, hasSrcDir, chalk) {
  console.log(
    chalk.gray(
      `  🎨 Tailwind CSS and globals.css have been set up with modern shadcn configuration`
    )
  );
}

async function addDatabaseScripts(targetDir, chalk) {
  console.log(chalk.blue("📝 Adding database scripts to package.json..."));

  const packageJsonPath = path.join(targetDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.log(
      chalk.yellow("⚠️  package.json not found, skipping script addition")
    );
    return;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Initialize scripts object if it doesn't exist
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    // Add database scripts
    const dbScripts = {
      "db:generate": "npx drizzle-kit generate",
      "db:migrate": "npx drizzle-kit migrate",
      "db:push": "npx drizzle-kit push",
      "db:studio": "npx drizzle-kit studio",
    };

    let scriptsAdded = [];
    let scriptsSkipped = [];

    for (const [scriptName, scriptCommand] of Object.entries(dbScripts)) {
      if (packageJson.scripts[scriptName]) {
        scriptsSkipped.push(scriptName);
      } else {
        packageJson.scripts[scriptName] = scriptCommand;
        scriptsAdded.push(scriptName);
      }
    }

    // Write back to package.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n"
    );

    if (scriptsAdded.length > 0) {
      console.log(
        chalk.green(`     ✓ Added scripts: ${scriptsAdded.join(", ")}`)
      );
    }
    if (scriptsSkipped.length > 0) {
      console.log(
        chalk.yellow(
          `     ⚠️  Scripts already exist (skipped): ${scriptsSkipped.join(
            ", "
          )}`
        )
      );
    }
  } catch (error) {
    console.log(
      chalk.red(`     ❌ Error updating package.json: ${error.message}`)
    );
  }
}

program.addHelpText(
  "after",
  `
Examples:
  $ npx nextjs-auth-starter init                    # Install with src/ directory structure
  $ npx nextjs-auth-starter init --no-install       # Skip dependency installation
  $ npx nextjs-auth-starter init -d ./my-project    # Install in specific directory

Structure:
  The CLI installs files using the modern Next.js src/ directory structure:
  - src/app/ for pages and API routes
  - src/components/ for UI components
  - src/lib/ for utilities and configuration
`
);

program.parse();
