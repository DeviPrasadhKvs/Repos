const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fundVerfication = new Schema({
    _id: {
        type: String,
    },
    profileId: {
        type: String
    },
    paymentType: {
        type: String
    },
    fee: {
        type: Number,
    },
    transcationId: {
        type: String,
    },
    amount: {
        type: Number
    },
    status: {
        type: String
    },
    payee_profileId: {
        type: String
    },
    payerId: {
        type: String
    },
    mode: {
        // [CARD||AUTO||WALLET]
        type: String
    },
    type: {
        // [VISA||MATER||MASTERO||AMERICAN||FOREX]
        type: String
    },
    currency: {
        type: String
    },
    customerID: {
        type: Number
    },
    description: {
        type: String
    },
    initiateTime: {
        type: Number
    },
    Paytime: {
        type: Number
    },
    payment_receipt_url: {
        type: String
    },
    country: {
        type: String
    },
    lastFour: {
        type: String
    },
    paymentMethodID: {
        type: String
    },
    paymentIntentID: {
        type: String
    }
})

const payments = mongoose.model('fundverification', fundVerfication)

module.exports = payments;