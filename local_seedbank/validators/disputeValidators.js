const {
    check
} = require('express-validator');


let disputeValidations = {

    raiseDispute: () => {
        return [
            check('collaborationID').exists(),
            check('disputeRaisedBy').exists(),
            check('disputeAgainst').exists(),
            check('disputeTitle').exists(),
            check('disputeDesciption').exists()
        ]
    },

    getProfileDisputes: () => {
        return [
            check('profileID').exists()
        ]
    },

    getDisputeDetails: () => {
        return [
            check('disputeID').exists(),
        ]
    }
}

module.exports = disputeValidations;