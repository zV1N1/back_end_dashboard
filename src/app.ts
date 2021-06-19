import 'reflect-metadata';
import { config } from 'dotenv';
import express from 'express';

import createConnection from './database';

import routes from './routes';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
createConnection();

const app = express();

app.use(express.json());
app.use(routes);

export { app };
