import { Router } from 'express';
import { getAllNotes } from '../controllers/notesController.js';
import { getNoteById } from '../controllers/notesController.js';
import { createNote } from '../controllers/notesController.js';
import { deleteNote } from '../controllers/notesController.js';
import { updateNote } from '../controllers/notesController.js';

const notesRouter = Router();

// Отримати всі нотатки
notesRouter.get('/notes', getAllNotes);

// Отримати нотатку за ID
notesRouter.get('/notes/:noteId', getNoteById);

// Створити нову нотатку
notesRouter.post('/notes', createNote);

// Видалити нотатку за ID
notesRouter.delete('/notes/:noteId', deleteNote);

// Оновити нотатку за ID
notesRouter.patch('/notes/:noteId', updateNote);

export default notesRouter;
