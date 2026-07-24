import { Router } from 'express';
import { registerUser } from '../controllers/authController.js';
import { celebrate } from 'celebrate';
import { registerUserSchema } from '../validations/authValidation.js';
import { loginUser } from '../controllers/authController.js';
import { loginUserSchema } from '../validations/authValidation.js';
import { logoutUser } from '../controllers/authController.js';
import { refreshUserSession } from '../controllers/authController.js';

import { requestResetEmail } from '../controllers/authController.js';
import { requestResetEmailSchema } from '../validations/authValidation.js';

import { resetPassword } from '../controllers/authController.js';
import { resetPasswordSchema } from '../validations/authValidation.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/auth/logout', logoutUser);
router.post('/auth/refresh', refreshUserSession);

router.post('/auth/request-reset-email', celebrate(requestResetEmailSchema), requestResetEmail);
router.post('/auth/reset-password', celebrate(resetPasswordSchema), resetPassword);

export default router;
