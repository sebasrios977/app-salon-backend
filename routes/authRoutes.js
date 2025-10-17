import express from "express";
import {
  register,
  verifyAccount,
  login,
  user,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas de autenticación y registro de usuarios
router
  .post("/register", register)
  .get("/verify/:token", verifyAccount)
  .post("/login", login);

// Requiere JWT
router.get("/user", authMiddleware, user);

export default router;
