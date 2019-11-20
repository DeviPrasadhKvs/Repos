const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GlobeScehma = Schema({
    lat :String,
    lng : String
})

module.exports = mongoose.model('globe', GlobeScehma)