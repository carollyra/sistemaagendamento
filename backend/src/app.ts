import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { routes } from './routes/index.js';

export const app = express();

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);
