const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    profileID: {
        type: String,
        unique: true
    },
    customerID: {
        type: String
    },
    createOn: {
        type: String
    },
    lastUpdatedOn: {
        type: String
    },
    lastPaymentDate: {
        type: String
    }
})

const customers = mongoose.model('customers', customerSchema)

module.exports = customers;