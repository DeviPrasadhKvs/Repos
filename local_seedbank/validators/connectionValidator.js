const {
    check
} = require('express-validator');


let connectionValidations = {


    connectionRequest: () => {
        return [
            check('sender').exists(),
            check('owner').exists()
        ]
    },

    getProfileConnection: () => {
        return [
            check('mProfileID').exists(),
            check('profileID').exists()
        ]
    },

    getUserAccess: () => {
        return [
            check('sender').exists(),
            check('owner').exists()
        ]
    },


    getOwnerConnections: () => {
        return [
            check('owner').exists(),
        ]
    },

    blockConnection: () => {
        return [
            check('target').exists(),
            check('profileID').exists()
        ]
    },

    blockProfileConnection: () => {
        return [
            check('profileID').exists()
        ]
    },
}

module.exports = bookmarkValidations;