const User = require('../models/user');

const {
  badRequest,
  notFound,
  internalServerError,
} = require('../errors/errors');

function getUsers(req, res) {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(internalServerError).send({ message: '«На сервере произошла ошибка' }));
}

function getUser(req, res) {
  const { id } = req.params;

  User
    .findById(id)
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(notFound).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(400).send({ message: 'Передан некорректный id' })
        : res.status(internalServerError).send({ message: 'На сервере произошла ошибка' })
    ));
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }

      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
}

function setUser(req, res) {
  const { name, about } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(notFound).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }

      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
}

function setUserAvatar(req, res) {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(notFound).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }

      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  setUser,
  setUserAvatar,
};
