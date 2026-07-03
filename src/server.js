import express from 'express';
import cors from 'cors';

import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';

import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { Logger } from './middleware/logger.js';
import notesRouter from './routes/notesRoutes.js';

await connectMongoDB();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(Logger);

app.use(notesRouter);

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// Middleware 500 для обробки помилок
app.use(errorHandler);

await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
