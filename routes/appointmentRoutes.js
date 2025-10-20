import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointmentsByDate,
  updateAppointment,
} from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .post("/", authMiddleware, createAppointment)
  .get("/", authMiddleware, getAppointmentsByDate);

router
  .get("/:id", authMiddleware, getAppointmentById)
  .put("/:id", authMiddleware, updateAppointment)
  .delete("/:id", authMiddleware, deleteAppointment);

export default router;
