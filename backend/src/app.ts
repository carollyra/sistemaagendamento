import cors from 'cors';
import express from 'express';
import { corsOptions } from './config/cors.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { routes } from './routes/index.js';

export const app = express();

app.use(cors(corsOptions));
// Answer preflight requests for every route.
app.options('/*splat', cors(corsOptions));
app.use(express.json());
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);
