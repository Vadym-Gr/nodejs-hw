import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find(); // Використовуємо модель Note для отримання всіх нотаток
  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    //return res.status(404).json({ message: 'Note not found' });
    throw createHttpError(404, `Note with ID ${noteId} not found`);
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    throw createHttpError(404, `Note with ID ${noteId} not found`);
  }

  res.status(200).json(note);
};
