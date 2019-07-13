const { GameModel: Game, winnerCombos } = require('./model');
const { check, body } = require("express-validator/check");
const mongoose = require('mongoose');

function validateMongooseType(value) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('ID is not valid');
  }
  return true
}

// Validations

const validate = method => {
  switch (method) {
    case "createGame": {
      return [
          check("player1", "player1 ID is required").exists(),
          check("player2", "player2 ID is required").exists(),
          body("player1").custom(validateMongooseType),
          body("player2").custom(validateMongooseType)
        ];
    }
    case "getGame": {
      return [
          check("_id", "_id is required").exists(),
          body('_id').custom(validateMongooseType)
        ];
    }
    case "deleteGame": {
      return [
          check("_id", "_id is required").exists(),
          body('_id').custom(validateMongooseType)
        ];
    }
    case "updateGame": {
      return [
        check("_id", "_id is required").exists(),
        body('_id').custom(validateMongooseType)
      ];
    }
    case "addPlayToGame": {
        return [
          check("_id", "_id is required").exists(),
          body('_id').custom(validateMongooseType),
          check("player1Play", "player1 play is required").exists(),
          check("player2Play", "player2 play is required").exists(),
          check("player1Play", "player1 play should be a number").isNumeric(),
          check("player2Play", "player2 play should be a number").isNumeric(),
          check("player1Play", "player1 play should be between 1 and 3").isIn([1,2,3]),
          check("player2Play", "player2 play should be between 1 and 3").isIn([1,2,3])
        ];
      }
  }
};

// CRUD methods

async function createGame(player1, player2) {
    try {
        const newGame = await Game.create({ player1, player2 });
        return newGame;
    } catch (error) {
        console.error('Error got from Mongo - creation :: ', error);
        return { error };
    }
}

async function getGame(_id) {
    try {
        const game = await Game.findOne({ _id });
        return game;
    } catch (error) {
        console.error('Error got from Mongo - get single :: ', error);
        return { error };
    }
}

async function getGames(params = {}) {
    try {
        const games = await Game.find({ ...params });
        return games;
    } catch (error) {
        console.error('Error got from Mongo - get multiple :: ', error);
        return { error };
    }
}

async function deleteGame(_id) {
    try {
        await Game.deleteMany({ _id })
        return true;
    } catch (error) {
        console.error('Error got from Mongo - delete :: ', error);
        return { error };
    }
}

async function updateGame(_id, updateData = {}) {
    try {
        const game = await Game.findOne({ _id });
        Object.keys(updateData).forEach((key) => {
            game[key] = updateData[key];
        });
        await game.save();
        return game;
    } catch (error) {
        console.error('Error got from Mongo - delete :: ', error);
        return { error };
    }
}

// Helper methods

function getWinnerPerPlay(player1Play, player2Play) {
    const combination = `${player1Play}${player2Play}`;
    const winnerPlay = winnerCombos[combination];
    if (winnerPlay) {
        return player1Play === winnerPlay ? 'player1' : 'player2'; 
    }
    return null;
}

function areThereAWinner(game) {
    let player1Wins, player2Wins = 0;
    game.plays.forEach((play) => {
        if (play.winner === 'player1') {
            player1Wins++;
        } else if (play.winner === 'player2') {
            player2Wins++;
        }
    });
    if (player1Wins >= 3) { return 'player1' };
    if (player2Wins >= 3) { return 'player2' };
    return null;
}

// RPC methods

async function addPlayToGame(_id, player1Play, player2Play) {
    try {
        const game = await Game.findOne({ _id });
        // If no game, 404
        if (!game) { return game };
        if (game.winner) { 
            game.return = true; 
            return game; 
        };
        const winnerRound = getWinnerPerPlay(player1Play, player2Play);
        const play = { player1Play, player2Play, winner: winnerRound };
        game.plays.push(play);
        await game.save();
        // Game played, check if are there a winner to change response
        const winner = areThereAWinner(game);
        if (winner) {
            game.winner = winner;
            game.save();
        }
        return { game, winner };
    } catch (error) {
        console.error('Error got from Mongo - delete :: ', error);
        return { error };
    }
}

module.exports = {
    createGame,
    getGame,
    getGames,
    updateGame,
    addPlayToGame,
    validate
}

