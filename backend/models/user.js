const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const RequestUnauthorized = require('../error_handlers/request-unauthorized-401');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Некорректная ссылка.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Неверный адрес электронной почты',
    },

  },
  password: {
    type: String,
    required: true,
    select: false, // Так по умолчанию хеш пароля пользователя не будет возвращаться из базы.
  },
});
// Но в случае аутентификации хеш пароля нужен.
// Чтобы это реализовать, после вызова метода модели,
// нужно добавить вызов метода select, передав ему строку +password:
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // в случае аутентификации хеш пароля нужен.
    .then((user) => {
      if (!user) {
        throw new RequestUnauthorized('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new RequestUnauthorized('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
