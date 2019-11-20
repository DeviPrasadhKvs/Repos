const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const copyRightTemp = new Schema({
    profileID: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        default: {},
        required: true
    }
});

module.exports = mongoose.model('cpyrighttemp', copyRightTemp);