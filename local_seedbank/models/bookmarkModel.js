const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookmarkSchema = Schema({
    bookMarkID: {
        type: String,
        required: true,
        unique: true
    },
    profileID: {
        type: String,
        required: true
    },
    bookmarkTypeID: {
        type: String,
        required: true
    },
    bookmarkType: {
        type: String
    }
})

module.exports = mongoose.model('bookmark', bookmarkSchema)