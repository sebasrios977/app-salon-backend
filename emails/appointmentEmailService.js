import { createTransport } from "../config/nodemailer.js";

export async function sendEmailNewAppointment({ date, time }) {
  const transport = createTransport(
    process.env.MAILTRAP_HOST,
    process.env.MAILTRAP_PORT,
    process.env.MAILTRAP_USER,
    process.env.MAILTRAP_PASS
  );

  const info = await transport.sendMail({
    from: "AppSalon <citas@appsalon.com>",
    to: 'admin@appsalon.com',
    subject: "AppSalon - Nueva Cita",
    text: "AppSalon - Nueva Cita",
    html: `
        <p>Hola: Admin, tienes una nueva cita</p>
        <p>La cita será  el día: ${date} y la hora: ${time}</p>
    `,
  });
  console.log("Mensaje enviado: %s", info.messageId);
}

export async function sendEmailUpdateAppointment({ date, time }) {
  const transport = createTransport(
    process.env.MAILTRAP_HOST,
    process.env.MAILTRAP_PORT,
    process.env.MAILTRAP_USER,
    process.env.MAILTRAP_PASS
  );

  const info = await transport.sendMail({
    from: "AppSalon <citas@appsalon.com>",
    to: 'admin@appsalon.com',
    subject: "AppSalon - Cita Actualizada",
    text: "AppSalon - Cita Actualizada",
    html: `
        <p>Hola: Admin, tienes una cita actualizada</p>
        <p>La cita será  el día: ${date} y la hora: ${time}</p>
    `,
  });
  console.log("Mensaje enviado: %s", info.messageId);
}

export async function sendEmailDeleteAppointment({ date, time }) {
  const transport = createTransport(
    process.env.MAILTRAP_HOST,
    process.env.MAILTRAP_PORT,
    process.env.MAILTRAP_USER,
    process.env.MAILTRAP_PASS
  );

  const info = await transport.sendMail({
    from: "AppSalon <citas@appsalon.com>",
    to: 'admin@appsalon.com',
    subject: "AppSalon - Cita Eliminada",
    text: "AppSalon - Cita Eliminada",
    html: `
        <p>Hola: Admin, tienes una cita eliminada</p>
        <p>La cita era el día: ${date} y la hora: ${time}</p>
    `,
  });
  console.log("Mensaje enviado: %s", info.messageId);
}
