const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sessionTimerSchema = Schema({
    collaborationID : {
        type : String,
        required : true
    },
    sessionID : {
        type : String,
        required : true
    },
    startTime : {
        type : Number,
    },
    sessions : {
        type : [{
            timestamp : Number,
            flag : String
        }]
    },
    endTime : Number,
    finished : Boolean,
    started :Boolean
})

module.exports = mongoose.model('sessionTimer', sessionTimerSchema)