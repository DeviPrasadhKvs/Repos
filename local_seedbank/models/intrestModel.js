const mongoose = require('mongoose')
const interestSchema = mongoose.Schema({
    interestID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }


})