import { Router } from 'express';
import AuthController from './controllers/AuthController';
import UserControllers from './controllers/UserControllers';

const router = Router();

// users
router.post('/users', UserControllers.store);

// auth
router.post('/auth', AuthController.store);
export default router;
