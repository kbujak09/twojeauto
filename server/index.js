const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const DB_URL = process.env.DATABASE_URL;

mongoose.connect(DB_URL)
  .then(() => console.log('Połączono z MongoDB'))
  .catch((err) => console.error('Błąd połączenia z bazą:', err));

app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('Serwer działa na porcie 3000');
});