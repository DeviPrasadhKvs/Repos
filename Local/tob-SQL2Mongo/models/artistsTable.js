const mongoose = require('mongoose')
const  artistsModel = new mongoose.Schema({
    firstName: String,
    lastName: String,
    name: String,
    email: String,
    phone: String,
    website:String,
    country: String,
    location: String,
    cityOrArea: String,
    instagram: String,
    facebook: String,
    twitter: String
})

module.exports = artistsModel