import { endOfDay, formatISO, isValid, parse, startOfDay } from "date-fns";
import Appointment from "../models/Appointment.model.js";
import { formatDateSpanish, validateObjectId } from "../utils/index.js";
import {
  sendEmailDeleteAppointment,
  sendEmailNewAppointment,
  sendEmailUpdateAppointment,
} from "../emails/appointmentEmailService.js";

const createAppointment = async (req, res) => {
  const appointment = req.body;
  appointment.user = req.user._id.toString();
  try {
    const newAppointment = new Appointment(appointment);
    const result = await newAppointment.save();

    await sendEmailNewAppointment({
      date: formatDateSpanish(result.date),
      time: result.time,
    });
    res.json({ msg: "Cita creada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear la cita" });
  }
};

const getAppointmentsByDate = async (req, res) => {
  const { date } = req.query;
  const newDate = parse(date, "dd/MM/yyyy", new Date());
  if (!isValid(newDate)) {
    const error = new Error("Fecha no válida");
    return res.status(400).json({ msg: error.message });
  }
  const isoDate = formatISO(newDate);
  const appointments = await Appointment.find({
    date: {
      $gte: startOfDay(new Date(isoDate)),
      $lte: endOfDay(new Date(isoDate)),
    },
  }).select("time");

  res.json(appointments);
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  // Validar por object id
  if (validateObjectId(id, res)) return;

  // Validar que la cita exista
  const appointment = await Appointment.findById(id).populate("services");

  if (!appointment) {
    const error = new Error("Cita no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  // Validar que el usuario sea el dueño de la cita
  if (
    req.user._id.toString() !== appointment.user.toString() &&
    !req.user.admin
  ) {
    const error = new Error("Acceso no autorizado");
    return res.status(403).json({ msg: error.message });
  }

  // Retornar la cita
  res.json(appointment);
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;

  // Validar por object id
  if (validateObjectId(id, res)) return;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      const error = new Error("Cita no encontrada");
      return res.status(404).json({ msg: error.message });
    }

    // Validar que el usuario sea el dueño de la cita
    if (
      req.user._id.toString() !== appointment.user.toString() &&
      !req.user.admin
    ) {
      const error = new Error("Acceso no autorizado");
      return res.status(403).json({ msg: error.message });
    }

    // Actualizar los campos de la cita
    Object.keys(req.body).forEach((key) => {
      appointment[key] = req.body[key];
    });

    const result = await appointment.save();
    await sendEmailUpdateAppointment({
      date: formatDateSpanish(result.date),
      time: result.time,
    });

    res.json({
      msg: "Cita actualizada correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al actualizar la cita" });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  // Validar por object id
  if (validateObjectId(id, res)) return;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      const error = new Error("Cita no encontrada");
      return res.status(404).json({ msg: error.message });
    }

    // Validar que el usuario sea el dueño de la cita
    if (
      req.user._id.toString() !== appointment.user.toString() &&
      !req.user.admin
    ) {
      const error = new Error("Acceso no autorizado");
      return res.status(403).json({ msg: error.message });
    }

    await appointment.deleteOne();

    await sendEmailDeleteAppointment({
      date: formatDateSpanish(appointment.date),
      time: appointment.time,
    });
    res.json({ msg: "Cita eliminada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al eliminar la cita" });
  }
};

export {
  createAppointment,
  getAppointmentsByDate,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
