const {
    check
} = require('express-validator');


let createProfileValidations = {

    insertProfile: () => {
        return [
            check('displayName').exists(),
            check('firstName').exists(),
            check('middleName').exists(),
            check('lastName').exists(),
            check('email').exists(),
            check('username').exists(),
            check('profileType').exists(),
            check('ima').exists(),
            check('gender').exists(),
            check('locationID').exists(),
            check('city').exists(),
            check('country').exists(),
            check('latitude').exists(),
            check('longitude').exists(),
            check('interests').exists(),
            check('profileID').exists(),
        ]
    },

    getProfile: () => {
        return [
            check('profileID').exists()
        ]
    },

    updateProfiles: () => {
        return [
            check('profileID').exists(),
            check('profileTypes').exists(),
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

module.exports = createProfileValidations;