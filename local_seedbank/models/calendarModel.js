const mongoose = require('mongoose')
const calendarSchema = new mongoose.Schema({
    eventID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    profileID: {
        type: String,
        required: true
    },
    profileType: {
        type: String,
    },
    fromTime: {
        type: Number,
        required: true
    },
    toTime: {
        type: Number,
        required: true
    },
    fromDate: {
        type: Number
    },
    toDate: {
        type: Number
    },
    locationID: {
        type: String,
        required: true
    },
    eventType: {
        type: String, //personal, private, public codes
        required: true
    },
    termsID: {
        type: String,

    },



})

module.exports = mongoose.model('calendar', calendarSchema)