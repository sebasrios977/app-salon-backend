import express from 'express';
import { register, verifyAccount, login } from '../controllers/authController.js';

const router = express.Router();

// Rutas de autenticación y registro de usuarios
router
    .post('/register', register)
    .get('/verify/:token', verifyAccount)
    .post('/login', login)


export default router;