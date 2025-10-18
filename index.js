import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import { db } from "./config/db.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

// Variables de entorno
dotenv.config();

// Configurar app
const app = express();

// Leer datos via body
app.use(express.json());

// Conectar a la base de datos
db();

// Habilitar CORS
const whiteList =
  process.argv[2] === "--postman"
    ? [process.env.FRONTEND_URL]
    : [process.env.FRONTEND_URL, undefined];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

// Definir una ruta
app.use("/api/services", servicesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

// Definir puerto
const PORT = process.env.PORT || 4000;

// Arrancar la app
app.listen(PORT, () => {
  console.log(
    colors.blue.bgMagenta.italic(
      `Servidor corriendo en http://localhost:${PORT}`
    )
  );
});
