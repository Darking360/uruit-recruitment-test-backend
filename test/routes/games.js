let {
  createGame,
  getGame,
  getGames,
  updateGame,
  deleteGame,
  addPlayToGame
} = require('../../models/games/controller');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();

function throwError(instance) {
    if (instance && !instance.err) {
        return instance;
    } else {
        throw new Error(instance.error);
    }
}

describe("Game's controllers", function() {
  
    it("creates a game", async () => {
        const game = {
            player1: '5d2bd7e78d9b260631473f84',
            player2: '5d2bd7e78d9b260631473f85'
        };
        const createdGame = await createGame(game.player1, game.player2);
        if (createdGame && !createdGame.err) {
            return createdGame;
        } else {
            throw new Error(createdGame.error)
        }
    });

    it("gets a game", async () => {
        const game = {
          player1: '5d2bd7e78d9b260631473f84',
          player2: '5d2bd7e78d9b260631473f85'
        };
        const createdGame = await createGame(game.player1, game.player2);
        if (throwError(createdGame)) {
            // Game created! Now retrieve
            const gotGame = await getGame(createdGame._id);
            return throwError(gotGame);
        }
    });

    it("gets all games", async () => {
        const allGames = await getGames();
        if (throwError(allGames)) {
            if (allGames.length >= 0) {
                return true
            } else {
                throw new Error("Error fetching games");
            }
        }
    });

    it("deletes a game", async () => {
        const game = {
          player1: '5d2bd7e78d9b260631473f84',
          player2: '5d2bd7e78d9b260631473f85'
        };
        const createdGame = await createGame(game.player1, game.player2);
        if (throwError(createdGame)) {
            // Game created! Now retrieve
            const deleted = await deleteGame(createdGame._id);
            if (deleted) {
                return true
            } else {
                throw new Error("Error deleting game")
            }
        }
    });

    it("updates a game", async () => {
        const game = {
          player1: '5d2bd7e78d9b260631473f84',
          player2: '5d2bd7e78d9b260631473f85'
        };
        const createdGame = await createGame(game.player1, game.player2);
        if (throwError(createdGame)) {
            // Game created! Now retrieve
            const gotGame = await updateGame(createdGame._id, { player1: '5d2bd7e78d9b260631473f86' });
            if (throwError(gotGame) && gotGame.player1 == '5d2bd7e78d9b260631473f86') {
                return true;
            } else {
                throw new Error("Error updating game");
            }
        }
    });

    it("adds plays to an existing game", async () => {
      const game = {
        player1: '5d2bd7e78d9b260631473f84',
        player2: '5d2bd7e78d9b260631473f85'
      };
      const createdGame = await createGame(game.player1, game.player2);
      if (throwError(createdGame)) {
          // Game created! Now add plays
          const addedPlay = await addPlayToGame(createdGame._id, 1, 2);
          if (throwError(addedPlay)) {
              return true;
          } else {
              throw new Error("Error updating game");
          }
      }
    });

    it("adds plays and got a winner", async () => {
      const game = {
        player1: '5d2bd7e78d9b260631473f84',
        player2: '5d2bd7e78d9b260631473f85'
      };
      const createdGame = await createGame(game.player1, game.player2);
      if (throwError(createdGame)) {
          // Game created! Now add plays
          await addPlayToGame(createdGame._id, 1, 2);
          await addPlayToGame(createdGame._id, 1, 2);
          const addedPlay = await addPlayToGame(createdGame._id, 1, 2);
          console.log(addedPlay)
          if (throwError(addedPlay) && addedPlay.winner && addedPlay.winner === 'player2') {
              return true;
          } else {
              throw new Error("Error updating game");
          }
      }
    });

});