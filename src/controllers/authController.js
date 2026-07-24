import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession } from '../services/auth.js';
import { setSessionCookies } from '../services/auth.js';

import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    email: req.body.email,
    password: hashedPassword
  });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);


 // console.log('req.body:', req.body.password, hashedPassword); // Додайте цей рядок для перевірки req.body


  res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  if (req.cookies.sessionId) {
    await Session.deleteOne({ _id: req.cookies.sessionId });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing tokens');
  }

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  };

  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();
  if (isRefreshTokenExpired) {
    await Session.deleteOne({ _id: sessionId });
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({ _id: sessionId });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ "message": "Session refreshed" });
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      message: 'If this email exists, a reset link has been sent',
    });
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }

	res.status(200).json({
		message: 'Password reset email sent successfully'
	});
};
