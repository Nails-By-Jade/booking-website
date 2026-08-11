import fs from "fs";
import path from "path";

/** Contact-form submissions. Same file-store pattern as the other stores. */

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "messages.json");

function readFile(): ContactMessage[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeFile(messages: ContactMessage[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), "utf-8");
}

export function getAllMessages(): ContactMessage[] {
  return readFile().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createMessage(
  input: Omit<ContactMessage, "id" | "createdAt">
): ContactMessage {
  const messages = readFile();

  const message: ContactMessage = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  writeFile(messages);
  return message;
}
