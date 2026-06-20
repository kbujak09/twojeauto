const { register, login } = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('jsonwebtoken');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('powinien utworzyć nowego użytkownika i zwrócić status 201', async () => {
      const req = { body: { email: 'test@test.com', password: 'password123', phone: '123456789' } };
      const res = mockResponse();

      const mockSave = jest.fn().mockResolvedValue(true);
      User.mockImplementation(() => ({ save: mockSave }));

      await register(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Konto zostało utworzone' });
    });

    it('powinien zwrócić błąd 400 przy duplikacie emaila', async () => {
      const req = { body: { email: 'test@test.com', password: 'password123', phone: '123456789' } };
      const res = mockResponse();

      const mockSave = jest.fn().mockRejectedValue({ code: 11000 });
      User.mockImplementation(() => ({ save: mockSave }));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Ten adres email jest już zajęty' });
    });
  });

  describe('login', () => {
    it('powinien zalogować użytkownika i zwrócić token', async () => {
      const req = { body: { email: 'test@test.com', password: 'password123' } };
      const res = mockResponse();

      const mockUser = {
        _id: 'user123',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('fake-jwt-token');

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(res.json).toHaveBeenCalledWith({ token: 'fake-jwt-token', message: 'Zalogowano pomyślnie' });
    });
  });
});