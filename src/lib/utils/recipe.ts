export type RecipeItem =
  | { type: "heading"; text: string }
  | { type: "item"; text: string; id: string };

export function parseRecipeItems(json: string | null | undefined): RecipeItem[] {
  if (!json) return [];
  try {
    const parsed = typeof json === "string" ? JSON.parse(json) : json;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((raw: unknown): RecipeItem | null => {
      if (!raw || typeof raw !== "object") return null;
      const item = raw as Record<string, unknown>;
      // "section" type from DB uses `title` key — normalize to heading
      if (item.type === "section") {
        return { type: "heading", text: String(item.title ?? item.text ?? "") };
      }
      if (item.type === "heading") {
        return { type: "heading", text: String(item.text ?? "") };
      }
      if (item.type === "item") {
        return { type: "item", text: String(item.text ?? ""), id: String(item.id ?? crypto.randomUUID()) };
      }
      return null;
    }).filter((x): x is RecipeItem => x !== null);
  } catch {
    return [];
  }
}

export function stringifyRecipeItems(items: RecipeItem[]): string {
  return JSON.stringify(items);
}

// --- Serving Scaler ---

const FRACTION_MAP: Record<string, number> = {
  "1/8": 0.125, "1/4": 0.25, "1/3": 0.333, "3/8": 0.375,
  "1/2": 0.5,  "5/8": 0.625, "2/3": 0.667, "3/4": 0.75,
  "7/8": 0.875,
};

const REVERSE_FRACTION_MAP: Record<string, string> = {
  "0.125": "1/8", "0.25": "1/4", "0.333": "1/3", "0.375": "3/8",
  "0.5": "1/2", "0.625": "5/8", "0.667": "2/3", "0.75": "3/4",
  "0.875": "7/8",
};

function parseFraction(s: string): number {
  if (FRACTION_MAP[s] !== undefined) return FRACTION_MAP[s];
  if (s.includes("/")) {
    const [num, den] = s.split("/").map(Number);
    return den ? num / den : 0;
  }
  return parseFloat(s);
}

function toFraction(n: number): string {
  const key = n.toFixed(3).replace(/\.?0+$/, "");
  if (REVERSE_FRACTION_MAP[key]) return REVERSE_FRACTION_MAP[key];
  const rounded = Math.round(n * 8) / 8;
  const fracKey = rounded.toFixed(3).replace(/\.?0+$/, "");
  if (REVERSE_FRACTION_MAP[fracKey]) return REVERSE_FRACTION_MAP[fracKey];
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(1).replace(/\.0$/, "");
}

// Matches: "1 1/2", "1/2", "2.5", "3"
const AMOUNT_RE = /^((\d+)\s+)?(\d+\/\d+|\d+\.?\d*)(\s|$)/;

// Matches ranges like "8-10" or "8 - 10"
const RANGE_RE = /^(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/;

export function scaleAmount(text: string, ratio: number): string {
  if (ratio === 1) return text;

  // Handle range like "8-10oz" → "16-20oz"
  const rangeMatch = text.match(RANGE_RE);
  if (rangeMatch) {
    const lo = parseFloat(rangeMatch[1]) * ratio;
    const hi = parseFloat(rangeMatch[2]) * ratio;
    const loStr = toFraction(lo);
    const hiStr = toFraction(hi);
    return `${loStr}-${hiStr}${text.slice(rangeMatch[0].length)}`;
  }

  const match = text.match(AMOUNT_RE);
  if (!match) return text;

  const whole = match[2] ? parseInt(match[2]) : 0;
  const frac = match[3] ? parseFraction(match[3]) : 0;
  const total = whole + frac;
  if (isNaN(total) || total === 0) return text;

  const scaled = total * ratio;
  const scaledWhole = Math.floor(scaled);
  const scaledFrac = scaled - scaledWhole;

  let result = "";
  if (scaledWhole > 0 && Math.abs(scaledFrac) < 0.01) {
    result = String(scaledWhole);
  } else if (scaledWhole > 0 && scaledFrac > 0.05) {
    result = `${scaledWhole} ${toFraction(scaledFrac)}`;
  } else if (scaledFrac > 0.05) {
    result = toFraction(scaledFrac);
  } else {
    result = scaled.toFixed(1).replace(/\.0$/, "");
  }

  return text.replace(AMOUNT_RE, result + " ").trimEnd() + text.slice((match[0] || "").length).trimStart()
    ? result + text.slice((match[0] || "").length)
    : result;
}

export function scaleItem(item: RecipeItem, ratio: number): RecipeItem {
  if (item.type !== "item") return item;
  return { ...item, text: scaleAmount(item.text, ratio) };
}

// --- Timer Extraction ---

export type ExtractedTimer = {
  label: string;
  seconds: number;
  original: string;
};

const TIMER_RE =
  /(\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)/gi;

export function extractTimers(text: string): ExtractedTimer[] {
  const timers: ExtractedTimer[] = [];
  let match: RegExpExecArray | null;
  while ((match = TIMER_RE.exec(text)) !== null) {
    const amount = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    let seconds = 0;
    if (unit.startsWith("h")) seconds = amount * 3600;
    else if (unit.startsWith("m")) seconds = amount * 60;
    else seconds = amount;
    timers.push({
      label: `${match[1]} ${match[2]}`,
      seconds: Math.round(seconds),
      original: match[0],
    });
  }
  return timers;
}
