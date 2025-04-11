import { MailtrapClient } from "mailtrap";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("MAILTRAP_TOKEN:", process.env.MAILTRAP_TOKEN || "Token Not Loaded");
console.log("MAILTRAP_ENDPOINT:", process.env.MAILTRAP_ENDPOINT || "Endpoint Not Loaded");

// Load variables
const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

if (!TOKEN || !ENDPOINT) {
  console.error("Missing Mailtrap configuration! Check your .env file.");
  process.exit(1);
}

export const mailtrapClient = new MailtrapClient({
  endpoint: ENDPOINT,
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Yujan Rai",
};



