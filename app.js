const express = require('express');
const session = require('express-session');

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
  req.session.usuario = { nombre: 'Juan', rol: 'admin' }; // Datos que deseas almacenar en la sesión
  res.send('Sesión creada');
});

// Ruta para ver los datos de la sesión
app.get('/ver-sesion', (req, res) => {
  if (req.session.usuario) {
    res.json(req.session.usuario);
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
