import { Router } from 'express';
import AuthController from './controllers/AuthController';
import UserControllers from './controllers/UserControllers';
import authMiddleware from './middlewares/auth';

const router = Router();

// users
router.post('/users', UserControllers.store);
router.put('/users', authMiddleware, UserControllers.update);
router.delete('/users', authMiddleware, UserControllers.delete);

// auth
router.post('/auth', AuthController.store);
export default router;
