const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Brak autoryzacji. Wymagany token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Nieważny lub wygasły token' });
  }
}

module.exports = verifyJWT;