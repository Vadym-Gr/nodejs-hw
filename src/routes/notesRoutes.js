import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getAllNotes } from '../controllers/notesController.js';
import { getNoteById } from '../controllers/notesController.js';
import { createNote } from '../controllers/notesController.js';
import { deleteNote } from '../controllers/notesController.js';
import { updateNote } from '../controllers/notesController.js';
import { getAllNotesSchema } from '../validations/notesValidation.js';
import { createNoteSchema } from '../validations/notesValidation.js';
import { noteIdSchema } from '../validations/notesValidation.js';
import { updateNoteSchema } from '../validations/notesValidation.js';

const notesRouter = Router();

// Отримати всі нотатки
notesRouter.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

// Отримати нотатку за ID
notesRouter.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

// Створити нову нотатку
notesRouter.post('/notes', celebrate(createNoteSchema), createNote);

// Видалити нотатку за ID
notesRouter.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

// Оновити нотатку за ID
notesRouter.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default notesRouter;
