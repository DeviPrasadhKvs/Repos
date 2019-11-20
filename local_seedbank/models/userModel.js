const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema
const userDataSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: String,
    active: {
        type: String,
        default: false
    },
    role: String, //admin or member
    profileID: String
})
userDataSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
userDataSchema.methods.matchPassword = (password, hash) => {
    try {
        return bcrypt.compareSync(password, hash)
    } catch (error) {
        return false;
    }
}
const User = mongoose.model('User', userDataSchema)
module.exports = User