const mongoose = require('mongoose');
const { Schema } = mongoose;

const plays = {
    paper: 1,
    scissors: 2,
    rock: 3
};

const winnerCombos = {
    '11': null,
    '22': null,
    '33': null,
    '12': 2,
    '21': 2,
    '13': 1,
    '31': 1,
    '12': 2,
    '21': 2,
    '23': 3,
    '32': 3
}

const GameSchema = new Schema({
    player1: { type: Schema.Types.ObjectId, ref: 'User' },
    player2: { type: Schema.Types.ObjectId, ref: 'User' },
    winner: { type: String, enum: ['player1', 'player2', null] },
    plays: [{
        player1Play: { type: Number, min: 1, max: 3 },
        player2Play: { type: Number, min: 1, max: 3 },
        winner: { type: String, enum: ['player1', 'player2', null] }
    }]
}, {timestamps: true});

const GameModel = mongoose.model('Game', GameSchema);

module.exports = {
    GameModel,
    GameSchema,
    winnerCombos
};