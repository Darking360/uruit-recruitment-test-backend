const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: String,
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }]
}, {timestamps: true});

const UserModel = mongoose.model('User', UserSchema);

export {
    UserModel,
    UserSchema
};