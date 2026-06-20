const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.JWT_SECRET;

const register = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    const newUser = new User({ email, password, phone });

    await newUser.save();
    res.status(201).json({ message: 'Konto zostało utworzone' })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ten adres email jest już zajęty' });
    }
    console.error(error);
    res.status(500).json({ error: 'Błąd serwera podczas rejestracji' });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Nie znaleziono użytkownika' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Błędne hasło' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1d' });
    res.json({ token, message: 'Zalogowano pomyślnie' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd serwera podczas logowania' });
  }
}

module.exports = { register, login };