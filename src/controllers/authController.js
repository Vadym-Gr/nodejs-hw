import createError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw createError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    email: req.body.email,
    password: hashedPassword
  });


 // console.log('req.body:', req.body.password, hashedPassword); // Додайте цей рядок для перевірки req.body


  res.status(201).json(user);
};
