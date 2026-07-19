import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import { errors } from "celebrate";
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';

import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logger);

app.use(notesRouter);
app.use(authRouter);

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// обробка помилок від celebrate (валідація)
app.use(errors());

// Middleware 500 для обробки інших помилок
app.use(errorHandler);

await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
