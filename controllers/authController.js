import User from "../models/User.model.js";
import {
  sendEmailForgotPassword,
  sendEmailVerification,
} from "../emails/authEmailService.js";
import { generateJWT, uniqueId } from "../utils/index.js";

const register = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    return res.status(400).json({ msg: error.message });
  }

  const { email, password, name } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("El usuario ya está registrado");
    return res.status(400).json({ msg: error.message });
  }

  const MIN_PASSWORD_LENGTH = 8;
  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    const error = new Error(
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
    );
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    const { name, email, token } = await user.save();
    sendEmailVerification({
      email,
      name,
      token,
    });
    res.json({
      msg: "Usuario registrado correctamente, revisa tu correo para verificar tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyAccount = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("Token no valido");
    return res.status(401).json({ msg: error.message });
  }
  try {
    user.token = "";
    user.verified = true;
    await user.save();
    res.json({ msg: "Cuenta verificada correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(401).json({ msg: error.message });
  }
  if (!user.verified) {
    const error = new Error("Tu cuenta no ha sido verificada");
    return res.status(401).json({ msg: error.message });
  }
  if (await user.comparePassword(password)) {
    const token = generateJWT(user._id);
    res.json({
      msg: "Usuario autenticado correctamente",
      token,
    });
  } else {
    const error = new Error("La contraseña es incorrecta");
    return res.status(403).json({ msg: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  try {
    user.token = uniqueId();
    const result = await user.save();

    await sendEmailForgotPassword({
      email: result.email,
      name: result.name,
      token: result.token,
    });
    res.json({ msg: "Correo enviado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al enviar el correo" });
  }
};

const verifyPasswordResetToken = async (req, res) => {
  const { token } = req.params;
  const isValidToken = await User.findOne({ token });

  if (!isValidToken) {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  }
  res.json({ msg: "Token valido" });
};

const updatePassword = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  }
  const { password } = req.body;
  try {
    user.token = "";
    user.password = password;
    await user.save();
    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const user = async (req, res) => {
  const { user } = req;
  res.json(user);
};

const admin = async (req, res) => {
  const { user } = req;
  if (!user.admin) {
    const error = new Error("Acceso no autorizado");
    return res.status(403).json({ msg: error.message });
  }

  res.json(user);
};

export {
  register,
  verifyAccount,
  login,
  user,
  admin,
  forgotPassword,
  verifyPasswordResetToken,
  updatePassword,
};
