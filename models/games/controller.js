const { GameModel: Game, winnerCombos } = './model';

// CRUD methods

export async function createGame(player1, player2) {
    try {
        const newGame = await Game.create({ player1, player2 });
        return newGame;
    } catch (error) {
        console.error('Error got from Mongo - creation :: ', error);
        return error;
    }
}

export async function getGame(_id) {
    try {
        const game = await Game.findOne({ _id });
        return game;
    } catch (error) {
        console.error('Error got from Mongo - get single :: ', error);
        return error;
    }
}

export async function getGames(params = {}) {
    try {
        const games = await Game.find({ ...params });
        return games;
    } catch (error) {
        console.error('Error got from Mongo - get multiple :: ', error);
        return error;
    }
}

export async function deleteGame(_id) {
    try {
        await Game.deleteMany({ _id })
        return true;
    } catch (error) {
        console.error('Error got from Mongo - delete :: ', error);
        return error;
    }
}

export async function updateGame(_id, updateData = {}) {
    try {
        const game = await Game.findOne({ _id });
        Object.keys(updateData).forEach((key) => {
            game[key] = updateData[key];
        });
        await game.save();
        return game;
    } catch (error) {
        console.error('Error got from Mongo - delete :: ', error);
        return error;
    }
}

// Helper methods

function getWinnerPerPlay({ player1Play, player2Play }) {
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

export async function addPlayToGame(_id, player1Play, player2Play) {
    try {
        const game = await Game.findOne({ _id });
        const winner = getWinnerPerPlay(player1Play, player2Play);
        const play = { player1Play, player2Play, winner };
        game.plays.push(play);
        await game.save();

        // Game played, check if are there a winner to change response
        const winner = areThereAWinner(game);
        return { game, winner };
    } catch (error) {
        console.error('Error got from Mongo - delete :: ', error);
        return error;
    }
}

