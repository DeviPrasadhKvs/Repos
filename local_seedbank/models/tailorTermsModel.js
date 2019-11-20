const mongoose = require('mongoose')
const tailorTermsSchema = new mongoose.Schema({
    termsType: {
        type: String,
        required: true
    },
    termsID: {
        type: String,
        required: true,
    },
    terms: {
        // fieldID: {
        //     type: String
        // },
        // value: {
        //     type: String
        // }
    },
    profileID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('tailorTerms', tailorTermsSchema)