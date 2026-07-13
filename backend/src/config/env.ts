import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  URL_MONGODB: z.string().min(1, "Missing URL_MONGODB env variable"),
  JWT_SECRET: z.string().min(1, "Missing JWT_SECRET env variable"),
  JWT_REFRESH_SECRET: z.string().min(1, "Missing JWT_REFRESH_SECRET env variable"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  GOOGLE_CALLBACK_URL: z.string().default("http://localhost:5000/api/v1/auth/google/callback"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1, "Missing SMTP_USER"),
  SMTP_PASS: z.string().min(1, "Missing SMTP_PASS"),
  SMTP_FROM: z.string().default("PixelMart <noreply@gmail.com>"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "Missing CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: z.string().min(1, "Missing CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: z.string().min(1, "Missing CLOUDINARY_API_SECRET"),

});

const env = envSchema.parse(process.env);

export default env;
