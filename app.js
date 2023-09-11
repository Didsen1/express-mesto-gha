const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const URL = 'mongodb://127.0.0.1:27017/mestodb';
const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);
mongoose.connect(URL);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64fec2b554b03411d11c205f',
  };

  next();
});

app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res, next) => {
  next(res.status(404).send({ message: 'Страницы по запрошенному URL не существует' }));
});

app.listen(PORT);
