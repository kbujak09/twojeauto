const { createCar, getCars } = require('../controllers/carController');
const Car = require('../models/Car');

jest.mock('../models/Car', () => {
  const MockModel = jest.fn();
  MockModel.find = jest.fn();
  MockModel.findById = jest.fn();
  MockModel.findByIdAndUpdate = jest.fn();
  MockModel.findOneAndDelete = jest.fn();
  return MockModel;
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Car Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCars', () => {
    it('powinien zwrócić listę ogłoszeń', async () => {
      const req = {};
      const res = mockResponse();

      const mockCars = [{ brand: 'Audi', model: 'A4' }];
      Car.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockCars) });

      await getCars(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCars);
    });
  });

  describe('createCar', () => {
    it('powinien zablokować utworzenie ogłoszenia przy błędnych danych (walidacja Zod)', async () => {
      const req = {
        user: { userId: 'user123' },
        body: { brand: 'BMW', price: -5000, vin: '123' }
      };
      const res = mockResponse();

      await createCar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Niepoprawne dane wejściowe' })
      );
    });

    it('powinien utworzyć ogłoszenie przy poprawnych danych', async () => {
      const req = {
        user: { userId: 'user123' },
        body: {
          brand: 'BMW', model: 'M3', year: 2020, price: 200000, mileage: 15000,
          engineCapacity: 3000, power: 450, fuelType: 'Benzyna', transmission: 'Automatyczna',
          bodyType: 'Sedan', color: 'Czarny', vin: 'WBA12345678901234',
          description: 'Bardzo długi opis samochodu, który ma minimum 20 znaków.'
        },
        files: []
      };
      const res = mockResponse();

      const mockSave = jest.fn().mockResolvedValue(true);
      Car.mockImplementation(() => ({ save: mockSave }));

      await createCar(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Ogłoszenie zostało dodane' })
      );
    });
  });
});