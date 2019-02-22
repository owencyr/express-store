require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const uuid = require('uuid/v4');
const { NODE_ENV } = require('./config');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(express.json());
app.use(cors());
app.use(helmet());

const users = [
  {
    id: '3c8da4d5-1597-46e7-baa1-e402aed70d80',
    username: 'sallyStudent',
    password: 'c00d1ng1sc00l',
    favoriteClub: 'Cache Valley Stone Society',
    newsLetter: 'true'
  },
  {
    id: 'ce20079c-2326-4f17-8ac4-f617bfd28b7f',
    username: 'johnBlocton',
    password: 'veryg00dpassw0rd',
    favoriteClub: 'Salt City Curling Club',
    newsLetter: 'false'
  }
];

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.get('/', (req, res) => {
  res.send('A GET Request');
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.send('POST request received');
});

app.post('/register', (req, res) => {
  // get the data
  const { username, password, favoriteClub, newsLetter = false } = req.body;
  // validation code here
  if (!username) {
    return res.status(400).send('Username required');
  }
  if (!password) {
    return res.status(400).send('Password required');
  }
  if (!favoriteClub) {
    return res.status(400).send('favorite Club required');
  }

  if (username.length < 6 || username.length > 20) {
    return res.status(400).send('Username must be between 6 and 20 characters');
  }
  // password length
  if (password.length < 8 || password.length > 36) {
    return res.status(400).send('Password must be between 8 and 36 characters');
  }
  // password contains digit, using a regex here
  if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    return res.status(400).send('Password must be contain at least one digit');
  }

  const clubs = [
    'Cache Valley Stone Society',
    'Ogden Curling Club',
    'Park City Curling Club',
    'Salt City Curling Club',
    'Utah Olympic Oval Curling Club'
  ];
  // make sure the club is valid
  if (!clubs.includes(favoriteClub)) {
    return res.status(400).send('Not a valid club');
  }

  const id = uuid();
  const newUser = {
    id,
    username,
    password,
    favoriteClub,
    newsLetter
  };
  users.push(newUser);

  res
    .status(201) // return "created" status
    .location(`http://localhost:8000/user/${id}`) // provide link to newly created user (requires GET user/:id endpoint)
    .json({ id: id }); // also return relevant data to the client, in this case the uuid generated by the server on user creation
});

app.delete('/user/:userId', (req, res) => {
  // ...
  const { userId } = req.params;
  console.log(userId);
  res.send('Got it.');
});

module.exports = app;
