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
const expect = chai.expect;
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

chai.use(chaiHttp);

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

describe("Game's routes", function() {
  it("/GET :: gets all games", done => {
    chai
      .request(server)
      .get("/games")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  it("/POST :: creates a new game", done => {
    const newGame = {
      player1: '5d2bdcc54d7e9e6d5d23a9d6',
      player2: '5d2bdcc54d7e9e6d5d23a9d7'
    };
    chai
      .request(server)
      .post("/games")
      .send(newGame)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("/POST :: error creating a new game with no player 1", done => {
    const newGame = {
      player2: '5d2bdcc54d7e9e6d5d23a9d7'
    };
    chai
      .request(server)
      .post("/games")
      .send(newGame)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a("object");
        expect(res.body.errors).to.satisfy(function(errors) {
          return errors.length >= 0;
        });
        done();
      });
  });

  it("/POST :: error creating a new game with no player 2", done => {
    const newGame = {
      player1: '5d2bdcc54d7e9e6d5d23a9d6'
    };
    chai
      .request(server)
      .post("/games")
      .send(newGame)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a("object");
        expect(res.body.errors).to.satisfy(function(errors) {
          return errors.length >= 0;
        });
        done();
      });
  });

  it("/POST :: error creating a new game with wrong objectIDs", done => {
    const newGame = {
      player1: '5d2bdcc54d7e',
      player2: '5d2bdcc54d7e9e623a9d7'
    };
    chai
      .request(server)
      .post("/games")
      .send(newGame)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a("object");
        expect(res.body.errors).to.satisfy(function(errors) {
          return errors.length >= 0;
        });
        done();
      });
  });

  it("/POST :: adds a play to a game", done => {
    const newPlay = {
      player1Play: 1,
      player2Play: 2
    };
    const newGame = {
      player1: '5d2bdcc54d7e9e6d5d23a9d6',
      player2: '5d2bdcc54d7e9e6d5d23a9d7'
    };
    chai
      .request(server)
      .post("/games")
      .send(newGame)
      .end((err, res) => {
        // Game created, pull gameId to subsquent requests
        const { body: { _id: gameId } } = res;
        chai
          .request(server)
          .post(`/games/add_play/${gameId}`)
          .send(newPlay)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
  });

  it("/POST :: error adding play to game :: no player 1 play", done => {
    const newPlay = {
      player2Play: 2
    };
    const newGame = {
      player1: '5d2bdcc54d7e9e6d5d23a9d6',
      player2: '5d2bdcc54d7e9e6d5d23a9d7'
    };
    chai
      .request(server)
      .post("/games")
      .send(newGame)
      .end((err, res) => {
        // Game created, pull gameId to subsquent requests
        const { body: { _id: gameId } } = res;
        chai
          .request(server)
          .post(`/games/add_play/${gameId}`)
          .send(newPlay)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a("object");
            expect(res.body.errors).to.satisfy(function(errors) {
              return errors.length >= 0;
            });
            done();
          });
      });
  });

  it("/POST :: error adding play to game :: no player 2 play", done => {
    const newPlay = {
      player1Play: 2
    };
    const newGame = {
      player1: '5d2bdcc54d7e9e6d5d23a9d6',
      player2: '5d2bdcc54d7e9e6d5d23a9d7'
    };
    chai
      .request(server)
      .post("/games")
      .send(newGame)
      .end((err, res) => {
        // Game created, pull gameId to subsquent requests
        const { body: { _id: gameId } } = res;
        chai
          .request(server)
          .post(`/games/add_play/${gameId}`)
          .send(newPlay)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a("object");
            expect(res.body.errors).to.satisfy(function(errors) {
              return errors.length >= 0;
            });
            done();
          });
      });
  });

  it("/POST :: adds a play to a game until winner is got at third play", done => {
    const newPlay = {
      player1Play: 1,
      player2Play: 2
    };
    const newGame = {
      player1: '5d2bdcc54d7e9e6d5d23a9d6',
      player2: '5d2bdcc54d7e9e6d5d23a9d7'
    };
    chai
      .request(server)
      .post("/games")
      .send(newGame)
      .end((err, res) => {
        // Game created, pull gameId to subsquent requests
        const { body: { _id: gameId } } = res;
        chai
          .request(server)
          .post(`/games/add_play/${gameId}`)
          .send(newPlay)
          .end((err, res) => {
            chai
            .request(server)
            .post(`/games/add_play/${gameId}`)
            .send(newPlay)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              chai
                .request(server)
                .post(`/games/add_play/${gameId}`)
                .send(newPlay)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a("object");
                  expect(res.body).to.satisfy(function(body) {
                    return body.winner && body.winner === 'player2';
                  });
                  done();
                });
            });
          });
      });
  });

});