#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

function getCurrentVersion() {
  const pkgPath = join(rootDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  return pkg.version;
}

function setVersion(newVersion) {
  const pkgPath = join(rootDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  return newVersion;
}

function validateVersion(version) {
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  if (!semverRegex.test(version)) {
    throw new Error(
      `Invalid version format: ${version}. Must be semver (e.g., 1.0.0, 1.0.0-beta.1)`
    );
  }
}

function bumpVersion(currentVersion, type) {
  const parts = currentVersion.split(".");
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  const patch = parseInt(parts[2].split("-")[0], 10);

  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${type}. Use major, minor, or patch`);
  }
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      stdio: "inherit",
      cwd: rootDir,
      ...options,
    });
  } catch (error) {
    console.error(`Error executing: ${command}`);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const versionArg = args[0];

  if (!versionArg) {
    console.error("Usage: npm run release [version|major|minor|patch]");
    console.error("Examples:");
    console.error("  npm run release patch     # 1.0.0 -> 1.0.1");
    console.error("  npm run release minor     # 1.0.0 -> 1.1.0");
    console.error("  npm run release major     # 1.0.0 -> 2.0.0");
    console.error("  npm run release 1.2.3     # Set specific version");
    process.exit(1);
  }

  const currentVersion = getCurrentVersion();
  console.log(`Current version: ${currentVersion}`);

  // Determine new version
  let newVersion;
  if (["major", "minor", "patch"].includes(versionArg)) {
    newVersion = bumpVersion(currentVersion, versionArg);
  } else {
    newVersion = versionArg;
    validateVersion(newVersion);
  }

  console.log(`New version: ${newVersion}`);

  // Check if there are uncommitted changes
  try {
    const status = execSync("git status --porcelain", {
      encoding: "utf-8",
      cwd: rootDir,
    });
    if (status.trim()) {
      console.error("Error: You have uncommitted changes. Please commit or stash them first.");
      process.exit(1);
    }
  } catch (error) {
    console.error("Error: Not a git repository or git not available");
    process.exit(1);
  }

  // Check if tag already exists
  try {
    execSync(`git rev-parse -q --verify "refs/tags/v${newVersion}" >/dev/null 2>&1`, {
      cwd: rootDir,
    });
    console.error(`Error: Tag v${newVersion} already exists`);
    process.exit(1);
  } catch (error) {
    // Tag doesn't exist, which is good
  }

  // Update package.json
  console.log("\n📝 Updating package.json...");
  setVersion(newVersion);

  // Commit the version change
  console.log("\n📦 Committing version change...");
  exec(`git add package.json`);
  exec(`git commit -m "chore: bump version to ${newVersion}"`);

  // Create git tag
  console.log(`\n🏷️  Creating git tag v${newVersion}...`);
  exec(`git tag -a "v${newVersion}" -m "Release v${newVersion}"`);

  // Push commit and tags
  console.log("\n🚀 Pushing to GitHub...");
  exec(`git push origin HEAD`);
  exec(`git push origin "v${newVersion}"`);

  console.log(`\n✅ Successfully released v${newVersion}!`);
  console.log(`   Tag pushed: v${newVersion}`);
  console.log(`   This will trigger the deployment workflow.`);
}

main();

