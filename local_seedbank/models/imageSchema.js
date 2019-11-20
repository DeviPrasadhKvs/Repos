const mongoose = require('mongoose')
const Schema = mongoose.Schema
const imageSchema = new Schema({
    imageID: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true

    },
    profileID: {
        type: String,
    },
    imageType: {
        type: String
    }


})

module.exports = mongoose.model('imageSchema', imageSchema)