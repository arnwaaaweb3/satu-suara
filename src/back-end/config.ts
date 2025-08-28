// src/back-end/config.ts
import dotenv from "dotenv";

const result = dotenv.config();
if (result.error) {
  console.error("Failed to load .env file:", result.error);
  process.exit(1); // Keluar jika gagal memuat .env
}

export const RELAYER_MNEMONIC = process.env.RELAYER_MNEMONIC as string;
if (!RELAYER_MNEMONIC) {
  console.error("Error: RELAYER_MNEMONIC is not set in .env file!");
  process.exit(1);
}

export const ADMIN_SECRET = process.env.ADMIN_SECRET || "satu-suara-secret";