const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const InaccurateDataError = require('../errors/InaccurateDataError');
const ForbiddenError = require('../errors/ForbiddenError');

function createCard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;

  Card
    .create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
}

function getCards(req, res, next) {
  Card
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

function setLikeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      {
        $addToSet: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при добавлении лайка карточке'));
      } else {
        next(err);
      }
    });
}

function unsetLikeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card
    .findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при снятии лайка карточки'));
      } else {
        next(err);
      }
    });
}

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({
    _id: req.params.cardId,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Данные по указанному id не найдены');
      }
      if (card.owner._id.toString() !== req.user._id) {
        if (cardOwnerId.valueOf() !== userId) throw new ForbiddenError('Нет прав доступа');
      }
      return Card.deleteOne({ _id: req.params.cardId }).then(() => res.send({ message: 'карточка успешно удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Введен некорректный тип данных (_id)'));
      } else next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  setLikeCard,
  unsetLikeCard,
};
