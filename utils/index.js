import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

const uniqueId = () =>
  Date.now().toString(32) + Math.random().toString(32).substring(2);

const generateJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

const formatDateSpanish = (date) => {
  return format(date, "PPPP", { locale: es });
};

export {
  validateObjectId,
  handleNotFoundError,
  uniqueId,
  generateJWT,
  formatDateSpanish,
};
