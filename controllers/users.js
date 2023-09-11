const User = require('../models/user');

function getUsers(req, res) {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send(`${err.message}`));
}

function getUser(req, res) {
  const { id } = req.params;

  User
    .findById(id)
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(400).send({ message: 'Передан некорректный id' })
        : res.status(500).send(`${err.message}`)
    ));
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }

      return res.status(500).send(`${err.message}`);
    });
}

function setUser(req, res) {
  const { name, about } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }

      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }

      return res.status(500).send(`${err.message}`);
    });
}

function setUserAvatar(req, res) {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  User
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }

      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }

      return res.status(500).send(`${err.message}`);
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  setUser,
  setUserAvatar,
};
