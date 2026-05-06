import express from 'express';
import morgan from 'morgan';
import { marketsRouter } from './routes/markets';
import { stakesRouter } from './routes/stakes';
import { reputationRouter } from './routes/reputation';
import { circlesRouter } from './routes/circles';
import { oracleRouter } from './routes/oracle';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/markets', marketsRouter);
app.use('/api/v1/stakes', stakesRouter);
app.use('/api/v1/users', reputationRouter);
app.use('/api/v1/circles', circlesRouter);
app.use('/api/v1/oracle', oracleRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
