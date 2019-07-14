const mongoose = require('mongoose');

function validateMongooseType(value) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('ID is not valid');
    }
    return true
}

module.exports = {
    validateMongooseType
}