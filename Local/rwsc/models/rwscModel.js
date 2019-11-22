const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const rwscModel = new Schema({

    id: {
        type: String
    },
    code: {
        type: String
    },
    address: {
        type: String
    },
    timestamp: {
        type: String
    },
    txid: {
        type: String
    },
    cValue: {
        type: String
    }
})

module.exports = mongoose.model('tables', rwscModel);