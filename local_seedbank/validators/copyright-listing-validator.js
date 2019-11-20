const {
    check
} = require('express-validator');
let copyrightListingValidations = {  
    addCopyrightListing: () => {
        return [
            check('profileID').exists(),
            check('copyrightTitle').exists(),
            check('copyrightDescription').exists()
        ]
    },

    updateCopyrightListing: () => {
        return [
            check('copyrightListingId').exists()
        ]
    },

    getCopyrightListing: () => {
        return [
            check('copyrightListingId').exists(),
        ]
    },

    getCopyrightListings: () => {
        return [
            check('profileID').exists(),
        ]
    },
    
    deleteCopyrightListing: () => {
        return [
            check('profileID').exists(),
            check('listingID').exists()
        ]
    },

    

}


module.exports = copyrightListingValidations;