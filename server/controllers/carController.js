const Car = require('../models/Car');

const getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas pobierania ogłoszeń' });
  }
}

const getCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ error: 'Nie znaleziono ogłoszenia' });
    }

    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas pobierania ogłoszenia' });
  }
}

const createCar = async (req, res) => {
  try {
    const owner_id = req.user.userId;
    const newCar = new Car({ ...req.body, owner_id });

    await newCar.save();
    res.status(201).json({ message: 'Ogłoszenie zostało dodane', car: newCar });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Niepoprawne dane wejściowe' });
  }
}

const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.userId;

    const car = await Car.findOneAndUpdate(
      { _id: id, owner_id },
      req.body,
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ error: 'Ogłoszenie nie istnieje lub brak uprawnień' })
    }

    res.json({ message: 'Ogłoszenie zaktualizowane' }, car);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Błąd podczas aktualizacji' });
  }
}

const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.userId;

    const car = await Car.findOneAndDelete({ _id: id, owner_id });

    if (!car) {
      return res.status(404).json({ error: 'Ogłoszenie nie istnieje lub brak uprawnień' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas usuwania' });
  }
}

module.exports = { getCars, getCar, createCar, updateCar, deleteCar };