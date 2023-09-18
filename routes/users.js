const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { URL_REGEX } = require('../utils/other');
const {
  getUsers,
  getUser,
  setUser,
  setUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), setUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(URL_REGEX),
  }),
}), setUserAvatar);

module.exports = router;
