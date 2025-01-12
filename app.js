const express = require('express');
const session = require('express-session');
const moment = require('moment-timezone');  // Importa la librería moment-timezone

const app = express();
const PORT = 3000;

// Configuración de express-session
app.use(
  session({
    secret: 'pilin', // Cambia esto por una clave más segura
    resave: false, // No guarda la sesión si no ha sido modificada
    saveUninitialized: true, // Guarda sesiones nuevas aunque no tengan datos
    cookie: { maxAge: 60000 }, // Duración de la cookie en milisegundos (60 segundos)
  })
);

// Ruta para crear o inicializar una sesión
app.get('/crear-sesion', (req, res) => {
  // Almacena la hora de creación de la sesión en la Ciudad de México
  req.session.usuario = {
    nombre: 'Juan',
    rol: 'admin',
    inicio: moment.tz('America/Mexico_City').valueOf(), // Hora de inicio de la sesión (en milisegundos)
    ultimoAcceso: moment.tz('America/Mexico_City').valueOf() // Hora de último acceso (inicialmente la misma que el inicio)
  };
  res.send('Sesión creada');
});

// Ruta para ver los datos de la sesión y antigüedad
app.get('/estado-sesion', (req, res) => {
  if (req.session.usuario) {
    const ahora = moment.tz('America/Mexico_City').valueOf(); // Hora actual
    const inicio = req.session.usuario.inicio; // Hora de inicio de la sesión
    const ultimoAcceso = req.session.usuario.ultimoAcceso; // Último acceso registrado
    const antiguedadMs = ahora - inicio; // Antigüedad en milisegundos

    // Calcular horas, minutos y segundos
    const horas = Math.floor(antiguedadMs / (1000 * 60 * 60));
    const minutos = Math.floor((antiguedadMs % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((antiguedadMs % (1000 * 60)) / 1000);

    // Actualizar último acceso en la sesión
    req.session.usuario.ultimoAcceso = ahora;

    // Responder con un JSON que incluye los datos de la sesión y antigüedad
    res.json({
      mensaje: 'Información de la sesión',
      sessionID: req.sessionID,
      inicio: moment(inicio).format('YYYY-MM-DD HH:mm:ss'),
      ultimoAcceso: moment(ultimoAcceso).format('YYYY-MM-DD HH:mm:ss'),
      antiguedad: `${horas} horas, ${minutos} minutos, ${segundos} segundos`
    });
  } else {
    res.send('No hay una sesión activa');
  }
});

// Ruta para actualizar la sesión
app.get('/actualizar-sesion', (req, res) => {
  if (req.session.usuario) {
    req.session.usuario.rol = 'editor'; // Ejemplo de actualización
    res.send('Sesión actualizada');
  } else {
    res.send('No hay una sesión activa para actualizar');
  }
});

// Ruta para destruir la sesión
app.get('/destruir-sesion', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send('Error al destruir la sesión');
    } else {
      res.send('Sesión destruida');
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
