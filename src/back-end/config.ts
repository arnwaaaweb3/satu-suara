// src/back-end/config.ts
import dotenv from "dotenv";
import path from "path"; // Tambahkan ini untuk path

// Load .env dari root direktori (D:/satu-suara/.env)
const dotenvPath = path.resolve(__dirname, "..", "..", ".env"); // Sesuaikan dari src/back-end ke root
const result = dotenv.config({ path: dotenvPath });
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