const mongoose = require('mongoose')

const Schema = mongoose.Schema

var keyStoreSchema = Schema({

    profileID: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    }


})

module.exports = mongoose.model('KEYStore', keyStoreSchema)