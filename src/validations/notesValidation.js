import { Joi, Segments } from 'celebrate';
import { TAGS } from '../constants/tags.js';
import { isValidObjectId } from 'mongoose';

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(3).max(20),
    tag: Joi.string().valid(...TAGS).messages({
      'string.base': 'Tag must be a string',
      'any.only': `Tag must be one of the following: ${TAGS.join(', ')}`,
    }),
    search: Joi.string().trim().allow('').messages({
      'string.base': 'Search must be a string',
    }),
  }),
};

// Схема для перевірки маршруту POST
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title must be at least {#limit} character long',
      'any.required': 'Title is required',
    }),
    content: Joi.string().default('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string().valid(...TAGS).messages({
      'string.base': 'Tag must be a string',
      'any.only': `Tag must be one of the following: ${TAGS.join(', ')}`,
    }),
  }),
};

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// Схема для перевірки параметра noteId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// Схема для перевірки маршруту PATCH
export const updateNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title must be at least {#limit} character long',
    }),
    content: Joi.string().messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string().valid(...TAGS).messages({
      'string.base': 'Tag must be a string',
      'any.only': `Tag must be one of the following: ${TAGS.join(', ')}`,
    }),
  }).min(1).messages({
    'object.min': 'At least one field (title, content, or tags) must be provided for update',
  }),
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};
