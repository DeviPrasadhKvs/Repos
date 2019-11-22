const {
    check
} = require('express-validator');


let connectionValidations = {


    addConnections: () => {
        return [
            check('sender').exists(),
            check('owner').exists()
        ]
    },

    removeConnections: () => {
        return [
            check('sender').exists(),
            check('owner').exists()
        ]
    },

    getProfileConnections: () => {
        return [
            check('mProfileID').exists(),
            check('profileID').exists()
        ]
    },

    changeUserStatus: () => {
        return [
            check('mProfileID').exists(),
            check('profileID').exists()
        ]
    },

    userRequests: () => {
        return [
            check('sender').exists(),
            check('owner').exists()
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

    getOwnerConnections: () => {
        return [
            check('owner').exists(),
        ]
    },




}

module.exports = connectionValidations;