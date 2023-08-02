const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/token');
const NotFoundError = require('../error_handlers/not-found-error');
const BadRequest = require('../error_handlers/bad-request-400');
const RequestConflict = require('../error_handlers/request-conflict-409');
const RequestUnauthorized = require('../error_handlers/request-unauthorized-401');

// Read ALL users:
function getUsers(req, res, next) {
  return User.find({})
    // Status 200:
    .then((user) => {
      // Status 200:
      res.send(user);
    })
    // Status 500 - Default
    .catch(next);
}

// Read ONE user:
function getUser(req, res, next) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        // Status 404:
        throw new NotFoundError(`Пользователь по указанному id: ${userId} не найден.`);
      }
      // Status 200:
      res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400:
        return next(new BadRequest('Указан некорректный id.'));
      }
      // Status 500 - Default
      return next(err);
    });
}

// Get Current User:
function getCurrentUser(req, res, next) {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        // Status 404:
        throw new NotFoundError(`Пользователь по указанному id: ${userId} не найден.`);
      }
      // Status 200:
      res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Status 400:
        return next(new BadRequest('Указан некорректный id.'));
      }
      // Status 500 - Default
      return next(err);
    });
}

// Create new user:
function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    // Status 201:
    .then((user) => res.status(201).json({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new RequestConflict('Пользователь с таким емайлом уже существует'));
      }
      if (err.name === 'ValidationError') {
        // Status 400:
        return next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      }
      // Status 500 - Default
      return next(err);
    });
}

// Authentication
function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new RequestUnauthorized('Пользователь с таким емайлом не существует в БД');
      }
      const token = generateToken({ _id: user._id }); // PAYLOAD { _id: user._id }
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 3600000 * 24 * 7,
      });
      res.json({ token });
    })
    // Status 500 - Default
    .catch(next);
}

// Update user's info:
function updateUser(req, res, next) {
  const uData = {
    name: req.body.name,
    about: req.body.about,
  };
  const id = req.user._id;
  return User.findByIdAndUpdate(id, uData, { new: true, runValidators: true })
    .then((user) => {
      // Status 404
      if (!user) {
        throw new NotFoundError(`Пользователь с указанным id: ${id} не найден.`);
      }
      // Status 200:
      res.send(user);
    })
    .catch((err) => {
      // Status 400:
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }
      // Status 500 - Default
      return next(err);
    });
}

// Update user's avatar:
function updateAvatar(req, res, next) {
  const uData = {
    avatar: req.body.avatar,
  };
  const id = req.user._id;
  return User.findByIdAndUpdate(id, uData, { new: true, runValidators: true })
    .then((user) => {
      // Status 404
      if (!user) {
        throw new NotFoundError(`Пользователь с указанным id: ${id} не найден.`);
      }
      res.send(user);
    })
    .catch((err) => {
      // Status 400:
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }
      // Status 500 - Default
      return next(err);
    });
}

// Export
module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
