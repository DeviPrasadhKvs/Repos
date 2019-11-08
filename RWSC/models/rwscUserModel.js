const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const rwscUserModel = new Schema({

    id: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    }
})

module.exports = mongoose.model('rwscUsersDb', rwscUserModel);