const mongoose = require('mongoose');
const schema = mongoose.Schema()

const tattooModel = new schema({
    name: String,
    location: String,
    website: String,
    email: String,
    facebook: String,
    instagram: String,
    twitter: String,
    phone: String
})

mongoose.exports = mongoose.model('tattoo', tattooModel);


