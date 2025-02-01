import React, { useState } from 'react';
import './AdminPage.css';

function AdminPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/.netlify/functions/send-phishing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail: email })
      });

      if (!response.ok) throw new Error('Error al enviar');
      
      setStatus('Email enviado exitosamente');
      setEmail('');
    } catch (error) {
      setStatus('Error al enviar el email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>Panel de Administración</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo objetivo"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar correo de phishing'}
        </button>
      </form>
      {status && <p className={status.includes('Error') ? 'error' : 'success'}>{status}</p>}
    </div>
  );
}

export default AdminPage; 