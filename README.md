# Instagram Security Testing Tool 🎣

Una herramienta educativa para pruebas de seguridad que simula la interfaz de inicio de sesión de Instagram. Diseñada con fines de investigación y educación en ciberseguridad.

## 🚨 Aviso Legal

Esta herramienta está diseñada **exclusivamente** para fines educativos y de investigación. El uso indebido de esta herramienta puede violar leyes locales e internacionales.


## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - React 18.3.1
  - CSS3 para estilos personalizados
  - Diseño responsive

- **Backend:**
  - Node.js con Netlify Functions
  - Nodemailer para envío de correos

- **Infraestructura:**
  - Netlify para hosting y serverless functions
  - Sistema de control de versiones Git

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Cuenta de Gmail
- Netlify CLI

## 🚀 Instalación

1. **Clonar el repositorio:**
bash
git clone https://github.com/tu-usuario/instagram-security-testing.git
cd instagram-security-testing

2. **Instalar dependencias:**
bash
npm install
npm install -g netlify-cli

3. **Configurar variables de entorno:**
   
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo .env con tus credenciales
# EMAIL_USER: Tu dirección de Gmail
# EMAIL_PASS: Tu contraseña de aplicación de Gmail (16 caracteres)
```

4. **Configurar Gmail:**
   - Activa la verificación en dos pasos en tu cuenta de Gmail
   - Genera una contraseña de aplicación:
     1. Ve a https://myaccount.google.com/security
     2. Selecciona "Contraseñas de aplicación"
     3. Genera una nueva contraseña
     4. Copia la contraseña de 16 caracteres en tu .env



## 🔧 Configuración de Desarrollo

1. **Vincular con Netlify:**
bash
netlify login
netlify link

2. **Iniciar el servidor de desarrollo:**
bash
netlify dev


La aplicación estará disponible en:
- Frontend: http://localhost:8888
- Funciones serverless: http://localhost:9999/.netlify/functions/

## 📦 Estructura del Proyecto


instagram-security-testing/
├── netlify/
│ └── functions/
│ ├── handle-login.js # Maneja las credenciales capturadas
│ └── send-phishing.js # Envía correos de prueba
├── src/
│ ├── LoginPage.jsx # Componente principal
│ └── LoginPage.css # Estilos
├── .env # Variables de entorno (no subir a git)
└── netlify.toml # Configuración de Netlify

## 🔍 Características

- Interfaz idéntica al login de Instagram
- Panel de administración oculto
- Sistema de envío de correos automatizado
- Captura de datos de sesión
- Redirección automática post-captura

## 📝 Uso

1. Inicia la aplicación en modo desarrollo
2. Accede al panel de administración (botón oculto en el footer)
3. Introduce el email objetivo para la prueba
4. Las credenciales capturadas se enviarán al email configurado

## 🔐 Seguridad

- No almacena credenciales en bases de datos
- Transmisión segura mediante HTTPS
- Variables de entorno para datos sensibles
- Logs detallados de actividad

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## ⚠️ Importante

No subas nunca tu archivo `.env` a GitHub. Está incluido en `.gitignore` por seguridad.

## 📄 Licencia

Este proyecto es solo para fines educativos y de investigación.

## 👥 Autores

- Jose Vicente - [Tu Linkedin](https://www.linkedin.com/in/jose-vicente-alonso-betancourt-65207a234)