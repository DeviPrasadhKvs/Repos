const {
    check
} = require('express-validator');


let bookmarkValidations = {

    insertBookmark: () => {
        return [
            check('profileID').exists(),
            check('type').exists(),
            check('bookmarkID').exists()
        ]
    },

    getBookmarks: () => {
        return [
            check('bookmarkID').exists()
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