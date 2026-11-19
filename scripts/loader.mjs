import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    const basePath = path.resolve(process.cwd(), "src", rel);
    let target = basePath;
    if (!fs.existsSync(target)) {
      if (fs.existsSync(basePath + ".ts")) target = basePath + ".ts";
      else if (fs.existsSync(basePath + ".tsx")) target = basePath + ".tsx";
      else if (fs.existsSync(basePath + "/index.ts")) target = basePath + "/index.ts";
    }
    return nextResolve(pathToFileURL(target).href, context);
  }
  return nextResolve(specifier, context);
}
