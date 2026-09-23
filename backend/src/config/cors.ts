import type { CorsOptions } from 'cors';
import { AppError } from '../middlewares/error-handler.js';
import { env } from './env.js';

/** Methods the API actually answers to. */
const ALLOWED_METHODS = ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'];

const ALLOWED_HEADERS = ['Content-Type', 'Authorization'];

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // No Origin header: curl, health checks and server to server calls.
    if (!origin) {
      callback(null, true);
      return;
    }

    // "*" reflects the caller's origin, which keeps credentials working.
    if (env.corsOrigins.includes('*') || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new AppError(403, `Origem não autorizada pelo CORS: ${origin}`));
  },
  credentials: true,
  methods: ALLOWED_METHODS,
  allowedHeaders: ALLOWED_HEADERS,
  maxAge: 86_400,
  optionsSuccessStatus: 204,
};
