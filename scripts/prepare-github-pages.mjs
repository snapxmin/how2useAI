import fs from "fs";
import path from "path";

const apiDir = path.join("app", "api");

if (process.env.GITHUB_PAGES === "true" && fs.existsSync(apiDir)) {
  fs.rmSync(apiDir, { recursive: true, force: true });
}
