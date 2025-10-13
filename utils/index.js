import mongoose from "mongoose";
import Services from "../models/Services.model.js";

function validateObjectId(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("ID de servicio no válido");
    return res.status(400).json({ msg: error.message });
  }
}

async function handleNotFoundError(msg, res) {
  const error = new Error(msg);
  return res.status(404).json({ msg: error.message });
}

export { validateObjectId, handleNotFoundError };
