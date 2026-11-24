import fs from "node:fs";
import path from "node:path";
import { DEFAULT_PRICING_CONFIG, type PricingConfig } from "@/lib/pricing";

const CONFIG_FILE = path.resolve(process.cwd(), "data/pricing_config.json");

export function getLocalPricingConfig(): PricingConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.categories)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read local pricing config:", err);
  }
  return DEFAULT_PRICING_CONFIG;
}

export function saveLocalPricingConfig(config: PricingConfig): boolean {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to save local pricing config:", err);
    return false;
  }
}
