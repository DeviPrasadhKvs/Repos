const {
    check
} = require('express-validator');


let registrationValidator = {

    storeKeys: () => {
        return [
            check('displayName').exists(),
            check('firstName').exists(),
            check('middleName').exists(),
            check('lastName').exists(),
            check('email').exists(),
            check('username').exists(),
            check('profileType').exists(),
            check('gender').exists(),
            check('locationID').exists(),
            check('city').exists(),
            check('country').exists(),
            check('latitude').exists(),
            check('longitude').exists(),
            check('interests').exists()
        ]
    }
}

module.exports = registrationValidator;