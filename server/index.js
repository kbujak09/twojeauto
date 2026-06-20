require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Pakiety bezpieczeństwa
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

const app = express();

app.use(helmet());

app.use(cors());
app.use(express.json());

app.use(xss());

app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: 'Przekroczono limit zapytań. Spróbuj ponownie później.'
});
app.use('/api', limiter);

const DB_URL = process.env.DATABASE_URL;

mongoose.connect(DB_URL)
  .then(() => console.log('Połączono z MongoDB'))
  .catch((err) => console.error('Błąd połączenia z bazą:', err));

app.use('/api', authRoutes);
app.use('/api/cars', carRoutes);

app.listen(3000, () => {
  console.log('Serwer działa na porcie 3000');
});