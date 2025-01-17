const express = require('express');
const session = require('express-session');
const moment = require('moment-timezone');  // Importamos  la librería moment-timezone para el tiempo 

const app = express();
const PORT = 3000;

// Configuración de express-session
app.use(
  session({
    secret: 'pilin', 
    resave: false, 
    saveUninitialized: true, 
    cookie: { maxAge: 60000 }, 
  })
);

// Ruta para crear o inicializar una sesión
app.get('/crear-sesion', (req, res) => {
 
  req.session.usuario = {
    nombre: 'Uriel',
    inicio: moment.tz('America/Mexico_City').valueOf(), 
    ultimoAcceso: moment.tz('America/Mexico_City').valueOf()
  };
  res.send('Sesión creada');
});


app.get('/estado-sesion', (req, res) => {
  if (req.session.usuario) {
    const ahora = moment.tz('America/Mexico_City').valueOf();
    const inicio = req.session.usuario.inicio; 
    const ultimoAcceso = req.session.usuario.ultimoAcceso; 
    const antiguedadMs = ahora - inicio; 

   
    const horas = Math.floor(antiguedadMs / (1000 * 60 * 60));
    const minutos = Math.floor((antiguedadMs % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((antiguedadMs % (1000 * 60)) / 1000);

   
    req.session.usuario.ultimoAcceso = ahora;

    res.json({
      mensaje: 'uriel_220879',
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
    req.session.usuario.rol = 'editor';
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


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${3000}`);
});
