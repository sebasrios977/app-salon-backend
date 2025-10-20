import Appointment from "../models/Appointment.model.js";

const getUserAppointments = async (req, res) => {
  const { user } = req.params;
  console.log(req.user);
  if (user !== req.user._id.toString() && req.user.admin !== true) {
    return res.status(400).json({ msg: "Acceso no autorizado" });
  }

  try {
    const query = req.user.admin
      ? { date: { $gte: new Date() } }
      : { user, date: { $gte: new Date() } };
    const appointments = await Appointment.find(query)
      .populate("services user")
      .populate({ path: "user", select: "name email" })
      .sort({ date: "asc" });
    res.json(appointments);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Error al obtener las citas del usuario" });
  }
};

export { getUserAppointments };
