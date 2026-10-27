// Carga las variables del archivo .env ANTES de todo lo demás.
require('dotenv').config({ quiet: true });

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});