import fs from "fs";
import path from "path";

export type BlockedDate = {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
  createdAt: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "blocked-dates.json");

function readFile(): BlockedDate[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeFile(entries: BlockedDate[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export function getAllBlockedDates(): BlockedDate[] {
  return readFile().sort((a, b) => a.date.localeCompare(b.date));
}

export function isDateBlocked(date: string): boolean {
  return readFile().some((b) => b.date === date);
}

export function addBlockedDates(dates: string[], reason: string): BlockedDate[] {
  const entries = readFile();
  const existing = new Set(entries.map((e) => e.date));

  const now = new Date().toISOString();
  for (const date of dates) {
    if (existing.has(date)) continue;
    entries.push({
      id: crypto.randomUUID(),
      date,
      reason,
      createdAt: now,
    });
    existing.add(date);
  }

  writeFile(entries);
  return entries;
}

export function deleteBlockedDate(id: string): boolean {
  const entries = readFile();
  const next = entries.filter((e) => e.id !== id);
  if (next.length === entries.length) return false;
  writeFile(next);
  return true;
}