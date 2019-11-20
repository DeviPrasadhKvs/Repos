const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payoutSchema = new Schema({
    profileID: {
        type: String
    },
    payouts: {
        type: [{
            profileID: { type: String },
            payoutType: { type: String },
            default: { type: Boolean },
            payoutId: { type: String },
            code: { type: String }
        }],
        default: []
    }

})

const payouts = mongoose.model('payouts', payoutSchema)

module.exports = payouts;