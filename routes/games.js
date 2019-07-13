var express = require('express');
var router = express.Router();
const { validationResult } = require('express-validator');
const { getUser } = require('../models/users/controller');

const {
  createGame,
  getGame,
  getGames,
  deleteGame,
  updateGame,
  addPlayToGame,
  validate
} = require('../models/games/controller');

function transformParamsToBody(req, res, next) {
  Object.keys(req.params).forEach((key) => {
    req.body[key] = req.params[key];
  });
  next();
}

// CRUD

router.get('/',
  async function(req, res, next) {
    // Get all games
    const games = await getGames();
    if (games.err) {
      res.status(500);
      res.send(games.error);
    }
    res.status(200);
    res.send(games);
});

router.get('/:_id',
  transformParamsToBody,
  validate('getGame'),
  async function(req, res, next) {
    // Get a game
    req.body._id = req.params._id;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const game = await getGame(req.params._id);
    if (!game) {
      return res.status(404).json({ errors: [{ msg: 'Game not found' }] });
    }
    if (game.error) {
      res.status(500);
      res.send(game.error);
    }
    res.status(200);
    res.send(game);
});

router.post('/', 
  validate('createGame'),
  async function(req, res, next) {
    // Create new game
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const game = await createGame(req.body.player1, req.body.player2);
    if (game.err) {
      res.status(500);
      res.send(game.error);
    }
    res.status(200);
    res.send(game);
});

router.post('/add_play/:_id', 
  transformParamsToBody,
  validate('addPlayToGame'),
  async function(req, res, next) {
    // Create new game
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const game = await addPlayToGame(req.params._id, req.body.player1Play, req.body.player2Play);
    if (!game) {
        return res.status(404).json({ errors: [{ msg: 'Game not found' }] });
    }
    if (game.return && game.winner) {
      const winner = await getUser(game[game.winner]);
      return res.status(422).json({ errors: [{ msg: `This game already has a winner :: ${winner.username}` }] });
    }
    if (game.err) {
      res.status(500);
      res.send(game.error);
    }
    res.status(200);
    res.send(game);
});

module.exports = router;