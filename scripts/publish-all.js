import { execSync } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

function run(cmd, options = {}) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: rootDir, ...options });
}

async function publishAllPackages() {
  run(`changeset publish`);
}

publishAllPackages().catch((err) => {
  console.error(err);
  process.exit(1);
});
