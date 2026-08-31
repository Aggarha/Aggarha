import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),
  ADMIN_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(16),
  AUTH_SESSION_TTL_HOURS: z.coerce.number().int().positive().default(720),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Aggarha <noreply@aggarha.com>"),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_ENDPOINT: z.string().url(),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.string().url()
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.APP_URL,
  API_URL: process.env.API_URL,
  ADMIN_URL: process.env.ADMIN_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_SESSION_TTL_HOURS: process.env.AUTH_SESSION_TTL_HOURS,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_ENDPOINT: process.env.R2_ENDPOINT,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL
});
