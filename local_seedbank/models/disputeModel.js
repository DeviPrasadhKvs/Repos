const mongoose = require('mongoose')
const schema = mongoose.Schema

const disputeSchema = new schema({
    disputeID: {
        type: String,
        required: true,
        unique: true
    },
    collaborationID: {
        type: String,
        required: true,
        unique: true
    },
    disputeRaisedBy: {
        type: String,
        required: true
    },
    disputeAgainst: {
        type: String,
        required: true
    },
    disputeTitle: {
        type: String,
        required: true,
        derfalt: "SOME DISPUTE"
    },
    disputeDesciption: {
        type: String,
        required: true,
        default: "Some issue regarding the collaboration"
    },
    // disputeAgainstContract: {
    //     type: String,
    //     required: true
    // },
    disputeStatus: {
        type: String,
        required: true,
        default: "UNDER REVIEW" //SOLVED, UNDER VERIFICATION
    }


})

module.exports = mongoose.model('Dispute_DB', disputeSchema)