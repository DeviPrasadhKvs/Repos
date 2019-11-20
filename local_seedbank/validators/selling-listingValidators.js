const {
    check
} = require('express-validator');


let listingValidations = {

    addListing: () => {
        return [
            check('profileID').exists(),
            check('title').exists(),
            check('description').exists(),
            check('tags').exists(),
            check('price').exists(),
            check('fromDate').exists(),
            check('toDate').exists(),
            check('fromTime').exists(),
            check('toTime').exists(),
            check('additionalDetail').exists(),
            check('imageArray').exists(),
            check('listingType').exists()
        ]
    },

    updateListing: () => {
        return [
            check('listingID').exists()
        ]
    },

    getListing: () => {
        return [
            check('listingID').exists(),
        ]
    },

    getListings: () => {
        return [
            check('profileID').exists(),
        ]
    },

    deleteListing: () => {
        return [
            check('profileID').exists(),
            check('listingID').exists()
        ]
    }
}


module.exports = listingValidations;