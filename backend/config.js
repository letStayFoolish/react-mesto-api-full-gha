require('dotenv').config();

const { PORT = '8000' } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { JWT_SECRET_KEY = 'JWT_SECRET_KEY' } = process.env;

module.exports = {
  PORT,
  DB_ADDRESS,
  JWT_SECRET_KEY,
};
