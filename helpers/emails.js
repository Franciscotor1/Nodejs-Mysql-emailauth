import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, token } = datos;

  await transport.sendMail({
    from: 'Archivohistoricomzt.mx',
    to: email,
    subject: 'Confirma tu cuenta en www.Archivohistoricomzt.mx',
    text: '',
    html: `
      <p>HOLA ${nombre}, comprueba tu cuenta en www.Archivohistoricomzt.mx</p>
      <p>Tu cuenta ya está lista, confirma el siguiente enlace:
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a></p>
      <p>Si tu no creaste esta cuenta ignora el mensaje.</p>
    `
  });
};

export { emailRegistro };
