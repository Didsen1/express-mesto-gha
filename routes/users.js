const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  setUser,
  setUserAvatar,
} = require('../controllers/users');

router.post('/', createUser);

router.get('/', getUsers);
router.get('/:id', getUser);

router.patch('/me', setUser);
router.patch('/me/avatar', setUserAvatar);

module.exports = router;
