const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSignUpCMSmodel = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    userType: {
        type: Boolean,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('userSignUpCMS', userSignUpCMSmodel);