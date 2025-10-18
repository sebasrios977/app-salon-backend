import { endOfDay, formatISO, isValid, parse, startOfDay } from "date-fns";
import Appointment from "../models/Appointment.model.js";

const createAppointment = async (req, res) => {
  const appointment = req.body;
  appointment.user = req.user._id.toString();
  try {
    const newAppointment = new Appointment(appointment);
    await newAppointment.save();
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

export { createAppointment, getAppointmentsByDate };
