import 'dotenv/config';

// Fail fast: a missing secret must crash the process on boot, not surface as a
// confusing runtime error on the first request that needs it.
const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];
const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}. ` +
      `Copy .env.example to .env and fill them in.`
  );
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 4000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  TOKEN_EXPIRES: process.env.TOKEN_EXPIRES || '24h',
  // Comma-separated list of allowed browser origins (e.g. "https://app.vercel.app").
  // If unset, all origins are reflected — convenient for local dev, restrict in prod.
  CLIENT_ORIGINS: process.env.CLIENT_ORIGINS
    ? process.env.CLIENT_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : null,
};

export const isProd = env.NODE_ENV === 'production';
