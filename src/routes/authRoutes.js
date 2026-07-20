import { Router } from 'express';
import { registerUser } from '../controllers/authController.js';
import { celebrate } from 'celebrate';
import { registerUserSchema } from '../validations/authValidation.js';
import { loginUser } from '../controllers/authController.js';
import { loginUserSchema } from '../validations/authValidation.js';
import { logoutUser } from '../controllers/authController.js';
import { refreshUserSession } from '../controllers/authController.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/auth/logout', logoutUser);
router.post('/auth/refresh', refreshUserSession);

export default router;
