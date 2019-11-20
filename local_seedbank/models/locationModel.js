const mongoose = require('mongoose')
const locationSchema = mongoose.Schema({
    locationID: {
        type: String,
        required: true
    },
    profileID: {
        type: String,
        required: true
    },
    locationType: {
        type: String,
        required: true
    },
    locationTypeCode: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    other: {
        type: String
    },
    enabled: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('location', locationSchema);