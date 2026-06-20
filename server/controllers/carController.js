const Car = require('../models/Car');
const { z } = require('zod');

const carValidationSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.preprocess((val) => Number(val), z.number().min(1900).max(new Date().getFullYear())),
  price: z.preprocess((val) => Number(val), z.number().min(0)),
  mileage: z.preprocess((val) => Number(val), z.number().min(0)),
  engineCapacity: z.preprocess((val) => Number(val), z.number().min(0)),
  power: z.preprocess((val) => Number(val), z.number().min(0)),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  bodyType: z.string().min(1),
  color: z.string().min(1),
  vin: z.string().length(17),
  description: z.string().min(20)
});

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
    const car = await Car.findById(id).populate('owner_id', 'username email phone');
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
    const validatedData = carValidationSchema.parse(req.body);
    const owner_id = req.user.userId;
    const carData = { ...validatedData, owner_id };

    if (req.files && req.files.length > 0) {
      carData.images = req.files.map(file => file.path);
    }

    const newCar = new Car(carData);
    await newCar.save();

    res.status(201).json({ message: 'Ogłoszenie zostało dodane', car: newCar });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Niepoprawne dane wejściowe', details: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas tworzenia ogłoszenia' });
  }
}

const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ error: 'Nie znaleziono ogłoszenia' });
    if (car.owner_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Brak uprawnień' });
    }

    const validatedData = carValidationSchema.parse(req.body);

    let imagesToKeep = [];
    if (req.body.existingImages) {
      imagesToKeep = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }

    const newImages = req.files ? req.files.map(file => file.path) : [];
    const finalImages = [...imagesToKeep, ...newImages];

    const updatedData = {
      ...validatedData,
      images: finalImages
    };

    const updatedCar = await Car.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedCar);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Niepoprawne dane wejściowe', details: error.errors });
    }
    res.status(500).json({ error: 'Błąd podczas aktualizacji ogłoszenia' });
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

    res.json({ message: 'Ogłoszenie zostało usunięte' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas usuwania' });
  }
}

const getUserCars = async (req, res) => {
  try {
    const owner_id = req.user.userId;
    const cars = await Car.find({ owner_id }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas pobierania Twoich ogłoszeń' });
  }
}

module.exports = { getCars, getCar, createCar, updateCar, deleteCar, getUserCars };