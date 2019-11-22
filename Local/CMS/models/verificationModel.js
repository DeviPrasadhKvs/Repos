const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkDbModel = new Schema({

    profileId: {
        type: String,
        unique: true
    },
    profileStatus: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('checkDb', checkDbModel);