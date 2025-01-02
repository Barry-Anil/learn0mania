import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

const dbUrl = "postgresql://learnomania_owner:nlgf1MIT2GtR@ep-holy-star-a10qz5qr.ap-southeast-1.aws.neon.tech/learnomania?sslmode=require";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
