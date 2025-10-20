import express from "express";
import {
  register,
  verifyAccount,
  login,
  user,
  forgotPassword,
  verifyPasswordResetToken,
  updatePassword,
  admin,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas de autenticación y registro de usuarios
router
  .post("/register", register)
  .get("/verify/:token", verifyAccount)
  .post("/login", login)
  .post("/forgot-password", forgotPassword);

router.route("/forgot-password/:token")
  .get(verifyPasswordResetToken)
  .post(updatePassword);

// Requiere JWT
router.get("/user", authMiddleware, user);
router.get("/admin", authMiddleware, admin);

export default router;
