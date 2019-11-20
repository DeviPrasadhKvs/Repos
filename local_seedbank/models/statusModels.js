const mongoose = require('mongoose')
const statusSchema = mongoose.Schema({
    profileID: {
        type: String,
        required: true
    },
    profileImageSet: {
        type: Boolean,
        default: true
    },
    signatureSet: {
        type: Boolean,
        default: false
    },
    payoutStatus: {
        type: Boolean,
        default: false
    },
    calendarStatus: {
        type: Boolean,
        default: false
    },
    cardsStatus: {
        type: Boolean,
        default: false
    },
    activationStatus: {
        type: Boolean,
        default: false

    },
    tailorTerms: {
        type: Boolean,
        default: false,
        required: true
    },
    encryptionKeySet: {
        type: Boolean,
        default: false,
        required: true
    }


})

module.exports = mongoose.model('statusDetails', statusSchema)