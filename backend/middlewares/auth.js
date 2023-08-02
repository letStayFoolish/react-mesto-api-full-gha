const { checkToken } = require('../utils/token');
const RequestUnauthorized = require('../error_handlers/request-unauthorized-401');

const checkAuthentication = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return next(new RequestUnauthorized('Необходима авторизация.'));
  }
  let payload;
  try {
    payload = checkToken(jwt);
  } catch (error) {
    return next(new RequestUnauthorized('Необходима авторизация.'));
  }
  req.user = payload;
  return next();
};

module.exports = checkAuthentication;
