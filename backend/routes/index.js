const router = require('express').Router();
const NotFoundError = require('../error_handlers/not-found-error');

const cardsRoutes = require('./cards');
const usersRoutes = require('./users');
const signupRoutes = require('./signup');
const signoutRoutes = require('./signout');
const loginRoutes = require('./login');
const checkAuthentication = require('../middlewares/auth');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Before homepage login or sign-up:
router.use('/', loginRoutes);
router.use('/', signupRoutes);

// After login or sign-up, check authorization:
router.use(checkAuthentication);
// After successful authorization, client has access to:
router.use('/cards', cardsRoutes);
router.use('/users', usersRoutes);
router.use('/', signoutRoutes);
// Non-existent routes
router.use('/*', (req, res, next) => next(new NotFoundError('Указан некорректный путь в URL адресе')));
module.exports = router;
