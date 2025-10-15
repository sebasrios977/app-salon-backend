import User from "../models/User.model.js";
import { sendEmailVerification } from "../emails/authEmailService.js";

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
    user.token = '';
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
        res.json({
            msg: 'Usuario autenticado correctamente',
        });
    } else {
        const error = new Error("La contraseña es incorrecta");
        return res.status(403).json({ msg: error.message });
    }
}

export { register, verifyAccount, login };
