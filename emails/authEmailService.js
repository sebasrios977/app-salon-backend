import { createTransport } from "../config/nodemailer.js";

export async function sendEmailVerification({ name, email, token }) {
  const transport = createTransport(
    process.env.MAILTRAP_HOST,
    process.env.MAILTRAP_PORT,
    process.env.MAILTRAP_USER,
    process.env.MAILTRAP_PASS
  );

  const info = await transport.sendMail({
    from: "AppSalon <cuentas@appsalon.com>",
    to: email,
    subject: "AppSalon - Confirma tu cuenta",
    text: "AppSalon - Confirma tu cuenta",
    html: `
        <p>Hola: ${name}, confirma tu cuenta en AppSalon</p>
        <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });
  console.log("Mensaje enviado: %s", info.messageId);
}
