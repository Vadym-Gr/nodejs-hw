import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search = '' } = req.query; // Виводимо об'єкт запиту в консоль
  const skip = (page - 1) * perPage; // Обчислюємо кількість пропущених документів

  const notesQuery = Note.find(); // Використовуємо модель Note для отримання всіх нотаток

  if (tag) {
    notesQuery.where('tag').equals(tag);
  };

  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  };

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage)
  ]); // Використовуємо модель Note для отримання всіх нотаток

  const totalPages = Math.ceil(totalNotes / perPage); // Обчислюємо загальну кількість сторінок

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes
  });
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

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId }, // Шукаємо по id
    req.body,
    { returnDocument: "after" }, // повертаємо оновлений документ
  );

  if (!note) {
	throw createHttpError(404, `Note with ID ${noteId} not found`);
  }

  res.status(200).json(note);
};
