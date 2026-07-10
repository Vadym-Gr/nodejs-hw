import { Joi, Segments } from 'celebrate';
import { TAGS } from '../constants/tags.js';
import { isValidObjectId } from 'mongoose';

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
    tags: Joi.string().valid(...TAGS).default(['Todo']).messages({
      'string.base': 'Tags must be a string',
      'any.only': `Tags must be one of the following: ${TAGS.join(', ')}`,
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
    tags: Joi.string().valid(...TAGS).messages({
      'string.base': 'Tags must be a string',
      'any.only': `Tags must be one of the following: ${TAGS.join(', ')}`,
    }),
  }).min(1).messages({
    'object.min': 'At least one field (title, content, or tags) must be provided for update',
  }),
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};
