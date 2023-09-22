const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const { URL_REGEX } = require('../utils/other');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Требуется ввести электронный адрес',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },

    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },

    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },

    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'Требуется ввести URL',
      },
    },
  },

  {
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (!user) throw new UnauthorizedError('Неверные почта или пароль');
            return bcrypt.compare(password, user.password)
              .then((matched) => {
                if (!matched) throw new UnauthorizedError('Неверные почта или пароль');

                return user;
              });
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
