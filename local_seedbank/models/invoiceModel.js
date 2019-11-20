const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    invoiceID: {
        type: String,
        required: true,
    },
    profileID: {
        type: String,
        required: true
    },
    payeeID: {
        type: String
    },
    transcationID: {
        type: String,
    },
    issueRaised: {
        type: Boolean,
        default: false
    },
    timeStamp: {
        type: Number
    },
    issues: [Object],
    sessions: [Object],
    extendedSessions: [Object],
    others: [Object],
    taxItems: [Object],
    deductions: [Object],
    isExtended: {
        type: Boolean,
        default: false
    },
    total: {
        type: Number,
        default: 0.0
    },
    status: {
        type: String
    },
    onHold: {
        type: Boolean,
        default: false
    },
    chargeDate: {
        type: Number
    },
    editStatus: [{
        item: {
            type: String
        },
        type: {
            type: String
        },
        editorId: {
            type: String
        }
    }],
    invoiceTotal: {
        type: Number,
        default: 0.00
    },
    description: {
        type: String
    },
    title: {
        type: String
    },
    location: {
        type: String
    },
    thumblain: {
        type: String
    },
    invoiceType: {
        type: String
    },
    invoiceTypeID: {
        type: String
    }
})

module.exports = mongoose.model('invoice', InvoiceSchema);