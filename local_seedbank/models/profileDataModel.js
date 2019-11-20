const mongoose = require('mongoose')
const Schema = mongoose.Schema



const profileDataSchema = new Schema({


    profileID: String,
    displayName: String,
    firstName: String,
    middleName: String,
    lastName: String,
    email: String,
    username: String,
    profileType: {
        type: [String]
    },
    gender: String,
    phoneNumber: String,
    ima: String,
    locationID: {
        type: String,
        required: true
    },
    website: String,
    facebook: String,
    twitter: String,
    instagram: String,
    website: String,
    facebook: String,
    twitter: String,
    instagram: String,
    settingsProgress: {
        type: Number,
        default: 10
    },
    profileViews: {
        type: Number,
        default: 0
    },
    suspended: {
        type: Boolean,
        default: false
    }



})



module.exports = mongoose.model('profile', profileDataSchema)