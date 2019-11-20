const {
    check
} = require('express-validator');


let createProfileValidations = {

    updateProfiles: () => {
        return [
            check('profileID').exists(),
            check('profileTypes').exists(),
        ]
    },

    getProfile: () => {
        return [
            check('profileID').exists()
        ]
    },

    getMyBookmarks: () => {
        return [
            check('profileID').exists(),
            // check('bookmarkID').exists()
        ]
    },

    deleteBookmark: () => {
        return [
            check('bookmarkID').exists()
        ]
    }
}

module.exports = bookmarkValidations;