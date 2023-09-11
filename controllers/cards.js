const Card = require('../models/card');

function deleteCard(req, res) {
  const { id } = req.params;

  Card
    .findByIdAndRemove(id)
    .then((card) => {
      if (card) return res.send({ data: card });

      return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(400).send({ message: 'Передан некорректный id' })
        : res.status(500).send(`${err.message}`)
    ));
}

function getCards(req, res) {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send(`${err.message}`));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card
    .create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' })
        : res.status(500).send(`${err.message}`)
    ));
}

function setLikeCard(req, res) {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card
    .findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (card) return res.send({ data: card });

      return res.status(404).send({ message: 'Передан несуществующий _id' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }

      return res.status(500).send(`${err.message}`);
    });
}

function unsetLikeCard(req, res) {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card
    .findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (card) return res.send({ data: card });

      return res.status(404).send({ message: 'Передан несуществующий _id' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятии лайка' });
      }

      return res.status(500).send(`${err.message}`);
    });
}

module.exports = {
  getCards,
  deleteCard,
  createCard,
  setLikeCard,
  unsetLikeCard,
};
