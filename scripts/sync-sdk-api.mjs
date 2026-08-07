import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(process.argv[2] ?? "../../turboism");
const gradle = join(sourceRoot, "gradlew");

if (!existsSync(gradle)) {
  throw new Error(`Turboism source repository not found: ${sourceRoot}`);
}

execFileSync(gradle, ["sdkApiDocs", "--no-daemon", "--console=plain"], {
  cwd: sourceRoot,
  stdio: "inherit",
});

const worktreeId = execFileSync("bash", ["scripts/dev/worktree-id.sh"], {
  cwd: sourceRoot,
  encoding: "utf8",
}).trim();
const generated = join(
  sourceRoot,
  "build",
  "worktree",
  worktreeId,
  "sdk",
  "docs",
  "javadoc",
);
const output = join(docsRoot, "public", "api", "sdk");

if (!existsSync(join(generated, "index.html"))) {
  throw new Error(`Generated SDK Javadoc is missing: ${generated}`);
}

rmSync(output, { recursive: true, force: true });
mkdirSync(dirname(output), { recursive: true });
cpSync(generated, output, { recursive: true });

const index = readFileSync(join(output, "index.html"), "utf8");
if (!index.includes("dev.turboism.sdk")) {
  throw new Error("Generated SDK Javadoc index does not contain the SDK package name");
}

console.log(`SDK Javadoc synced to ${output}`);
