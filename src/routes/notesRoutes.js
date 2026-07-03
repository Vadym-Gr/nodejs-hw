import { Router } from 'express';
import { getAllNotes } from '../controllers/notesController.js';
import { getNoteById } from '../controllers/notesController.js';

const notesRouter = Router();

// Отримати всі нотатки
notesRouter.get('/notes', getAllNotes);

// Отримати нотатку за ID
notesRouter.get('/notes/:noteId', getNoteById);

export default notesRouter;
