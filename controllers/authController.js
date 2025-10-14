import User from "../models/User.model.js";

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
    const error = new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    await user.save();
    res.json({
      msg: "Usuario registrado correctamente, revisa tu correo para verificar tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

export { register };
