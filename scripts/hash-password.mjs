// Run with: node scripts/hash-password.mjs "your-chosen-password"
// Copy the output into ADMIN_PASSWORD_HASH in .env.local

import crypto from "crypto";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(password, salt, 64).toString("hex");

console.log(`${salt}:${hash}`);
