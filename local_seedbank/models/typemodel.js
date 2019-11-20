const mongoose = require('mongoose')
const typeSchema = new mongoose.Schema({
    typeID: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    iconUrl: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    subTypes: {
        type: [String]
    }
})
module.exports = mongoose.model('typesList', typeSchema)