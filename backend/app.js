const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookies = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { PORT, DB_ADDRESS } = require('./config');
const routes = require('./routes/index');
const limiter = require('./utils/limiter');
const cors = require('cors')
const errorsHandlers = require('./middlewares/errorsHandler');
// old way: mongodb://localhost:27017/mestodb
mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});
const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'https://chili.nomoreparties.co'],
  credentials: true,
}))
app.use(helmet());
app.use(cookies());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
// Access to all routes:
app.use(routes);
app.use(errors());
app.use(errorsHandlers);
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
