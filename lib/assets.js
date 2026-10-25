import fs from "node:fs";
import path from "node:path";

// Server-only: true when `src` (a path like "/images/x.webp") exists in
// /public. Lets sections render placeholders until real assets are added.
export function publicFileExists(src) {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}
