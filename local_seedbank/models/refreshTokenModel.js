const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema

const refreshTokenSchema = new Schema({
    profileID : String,
    refreshJWT : String,
    userJWT : String

})

refreshTokenSchema.methods.hashToken = (token)=>{
    return bcrypt.hashSync(token, bcrypt.genSaltSync(10))
}

refreshTokenSchema.methods.matchToken = (token, hash)=>{
    try {
        return bcrypt.compareSync(token, hash)
    } catch (error) {
        return false;
    }
}

const refreshToken = mongoose.model('refreshToken', refreshTokenSchema)
module.exports = refreshToken