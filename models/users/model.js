const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, index: true, unique: true },
    avatar: { type: String, required: true },
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }]
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    UserModel,
    UserSchema
};