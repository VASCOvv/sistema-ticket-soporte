require('dotenv').config({ quiet: true });

const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`API escuchando en http://localhost:${PORT}`);

  // Prueba de conexión a la base de datos al iniciar.
  try {
    await pool.query('SELECT 1');
    console.log(`Conectado a MySQL (base de datos: ${process.env.DB_NAME})`);
  } catch (error) {
    console.error(`No se pudo conectar a MySQL (${error.code}). Revisa que esté encendido y los datos del .env`);
  }
});