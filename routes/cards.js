const router = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  setLikeCard,
  unsetLikeCard,
} = require('../controllers/cards');

router.post('/', createCard);

router.get('/', getCards);
router.delete('/:id', deleteCard);

router.put('/:cardId/likes', setLikeCard);
router.delete('/:cardId/likes', unsetLikeCard);

module.exports = router;
