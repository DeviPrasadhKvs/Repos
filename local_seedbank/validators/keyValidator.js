const {
    check
} = require('express-validator');


let keyStoreValidator = {

    storeKeys: () => {
        return [
            check('profileID').exists(),
            check('privateKey').exists(),
            check('publicKey').exists()
        ]
    },

    getProfileKeys: () => {
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

module.exports = keyStoreValidator;