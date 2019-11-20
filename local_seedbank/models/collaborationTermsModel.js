const mongoose = require('mongoose')
const termsSchema = mongoose.Schema({
    termsType: {
        type: String,
        required: true
    },
    questions: [{
        fieldID: {
            type: String,
            required: true
        },
        diplayName: {
            type: String
        },
        inputType: {
            type: String
        },
        options: [{}]
    }],
    termsText: {
        type: String
    }

})

module.exports = mongoose.model('collaborationTerms', termsSchema)