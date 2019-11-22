const crypto = require('crypto')
const unqid = require('uniqid')
const registrationValidator = require('../validators/registrationValidator')

module.exports = (app, userModel, profileDataModel, locationModel, preferencesModel, apiResponse, validationResult) => {

    app.get('/registration_test', (req, res) => {
        res.send('registration service is online !!!')
    })

    app.post('/register', registrationValidator.storeKeys(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error while fetching data'));
            }
            console.log(req.body);
            let profileData = new profileDataModel()
            let locationData = new locationModel()
            let userData = new userModel()
            let preferencesData = new preferencesModel()

            userData.password = userData.hashPassword(req.body.password)
            let profileID = crypto.createHash('md5').update(userData.hashPassword(req.body.email)).digest('hex');
            userData.profileID = profileID
            profileData.profileID = profileID
            locationData.profileID = profileID
            preferencesData.profileID = profileID

            let locationID = unqid('LOC')

            userData.email = req.body.email

            profileData.displayName = req.body.displayName
            profileData.firstName = req.body.firstName
            profileData.middleName = req.body.middleName
            profileData.lastName = req.body.lastName
            profileData.email = req.body.email
            profileData.username = req.body.username
            profileData.profileType = req.body.profileType.split(',')
            profileData.gender = req.body.gender
            profileData.locationID = locationID

            locationData.locationType = 'USERLOCATION'
            locationData.locationTypeCode = 'CURRENT'
            locationData.locationID = locationID
            locationData.city = req.body.location.city
            locationData.country = req.body.location.country
            locationData.latitude = req.body.location.latitude
            locationData.longitude = req.body.location.longitude

            preferencesData.interests = req.body.interests.split(',')

            userData.save().then(usrData => {
                locationData.save().then(locData => {
                    profileData.save().then(profData => {
                        preferencesData.save().then(prefData => {
                            res.status(200).send(apiResponse.sendReply(1, 'user registration successfull, please verify email to continue'))
                        })
                    })
                })
            })
        } catch (err) {
            console.log(err);
            res.status(500).send(apiResponse.sendReply(0, 'validation error in registration'))
        }
    })

}