require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const DB_URL = process.env.DATABASE_URL;

mongoose.connect(DB_URL)
  .then(() => console.log('Połączono z MongoDB'))
  .catch((err) => console.error('Błąd połączenia z bazą:', err));

app.use('/api', authRoutes);
app.use('/api/cars', carRoutes);

app.listen(3000, () => {
  console.log('Serwer działa na porcie 3000');
});