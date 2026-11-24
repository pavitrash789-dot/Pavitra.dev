import { pathToFileURL, fileURLToPath } from "node:url";
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

  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL));
    const targetPath = path.resolve(parentDir, specifier);
    if (!fs.existsSync(targetPath)) {
      if (fs.existsSync(targetPath + ".ts")) return nextResolve(pathToFileURL(targetPath + ".ts").href, context);
      if (fs.existsSync(targetPath + ".tsx")) return nextResolve(pathToFileURL(targetPath + ".tsx").href, context);
    }
  }

  return nextResolve(specifier, context);
}
