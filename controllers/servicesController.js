import Services from "../models/Services.model.js";
import { validateObjectId, handleNotFoundError } from "../utils/index.js";

const createService = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const service = new Services(req.body);
    await service.save();
    res.json({
      msg: "Servicio creado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al crear el servicio" });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Services.find();
    res.json(services);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al obtener los servicios" });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;
  if (validateObjectId(id, res)) return;

  try {
    const service = await Services.findById(id);
    if (!service) return handleNotFoundError("Servicio no encontrado", res);
    res.json(service);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al obtener el servicio" });
  }
};

const updateService = async (req, res) => {
  const { id } = req.params;
  if (validateObjectId(id, res)) return;

  try {
    const service = await Services.findById(id);
    if (!service) return handleNotFoundError("Servicio no encontrado", res);

    // Actualizar los campos del servicio
    Object.keys(req.body).forEach((key) => {
      service[key] = req.body[key];
    });

    await service.save();
    res.json({
      msg: "Servicio actualizado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al actualizar el servicio" });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  if (validateObjectId(id, res)) return;

  try {
    const service = await Services.findById(id);
    if (!service) return handleNotFoundError("Servicio no encontrado", res);

    await service.deleteOne();
    res.json({
      msg: "Servicio eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al eliminar el servicio" });
  }
};

export {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
