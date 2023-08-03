const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const RequestUnauthorized = require('../error_handlers/request-unauthorized-401');

function generateToken(payload) {
  return jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });
  // return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function checkToken(token) {
  if (!token) {
    throw new RequestUnauthorized('Недостаточно прав для выполнения операции.');
  }

  // eslint-disable-next-line no-useless-catch
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw err;
  }
}

module.exports = { generateToken, checkToken };
