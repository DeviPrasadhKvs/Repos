const createProfileValidations = require('../validators/createProfile-validator')
const unqid = require('uniqid')

module.exports = (app, profileDataModel, locationModel, preferencesModel, apiResponse, statusModel, validationResult) => {


    app.get('/getdetails/:profileID', createProfileValidations.getProfile(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            let profileID = req.params.profileID;
            profileDataModel.find({ profileID }, (error, data) => {
                if (error) {
                    console.log('error');
                    return res.status(500).json(apiResponse.sendReply(0, 'Listing Get Details DB Query Error Occured'));
                } else {
                    console.log(data);

                    return res.status(200).json(apiResponse.sendReply(1, 'Listing data', data));
                }

            })
        } catch (error) {
            apiResponse.reportError(error)
            return res.status(500).json(apiResponse.sendReply(0, 'Listing Get Details Error Occured'));
        }
    })

    app.post('/updateProfileTypes', (req, res) => {
        console.log(req.body);

        let profileID = req.body.profileID
        let profileTypes = req.body.profileTypes
        profileDataModel.findOneAndUpdate({ profileID: profileID }, { profileType: profileTypes }).then((data) => {
            return res.status(200).json(apiResponse.sendReply(1, 'update successfull', {}));
        }).catch(error => {
            console.log(error);

            return res.status(500).json(apiResponse.sendReply(0, 'error in updating data'));
        })

    })


    app.post('/createprofile', (req, res) => {
        let profileData = new profileDataModel()
        let locationData = new locationModel()
        let preferencesData = new preferencesModel()

        let profileID = req.body.profileID
        profileData.profileID = profileID
        locationData.profileID = profileID
        preferencesData.profileID = profileID

        let locationID = unqid('LOC')

        profileData.displayName = req.body.data.displayName
        profileData.firstName = req.body.data.firstName
        profileData.middleName = req.body.data.middleName
        profileData.lastName = req.body.data.lastName
        profileData.email = req.body.data.email
        profileData.username = req.body.data.username
        profileData.profileType = req.body.data.profileType.split(',')
        profileData.ima = req.body.data.ima
        profileData.gender = req.body.data.gender
        profileData.locationID = locationID

        locationData.locationType = 'USERLOCATION'
        locationData.locationTypeCode = 'CURRENT'
        locationData.locationID = locationID
        locationData.city = req.body.data.location.city
        locationData.country = req.body.data.location.country
        locationData.latitude = req.body.data.location.latitude
        locationData.longitude = req.body.data.location.longitude

        preferencesData.interests = req.body.data.interests.split(',')

        locationData.save().then(locData => {
            profileData.save().then(profData => {
                preferencesData.save().then(prefData => {
                    statusData = new statusModel()
                    statusData.profileID = req.body.profileID
                    statusData.save().then(statusData => {
                        res.status(200).send(apiResponse.sendReply(1, 'user registration successfull, please verify email to continue'))
                    })
                })
            })
        }).catch(err => {
            console.log(err);
            res.status(500).send(apiResponse.sendReply(0, 'error in registration'))
        })

    })

    // app.post('/createprofile', (req, res) => {
    //     try {
    //         console.log(req.body);
    //         console.log(req.body);

    //         var profileData = new profileDataModel()
    //         profileData.displayName = req.body.data.displayName
    //         profileData.firstName = req.body.data.firstName
    //         profileData.middleName = req.body.data.middleName
    //         profileData.lastName = req.body.data.lastName
    //         profileData.username = req.body.data.username
    //         profileData.email = req.body.data.email
    //         profileData.ima = req.body.data.ima
    //         profileData.profileType = req.body.data.profileType
    //         profileData.gender = req.body.data.gender
    //         profileData.profileID = req.body.profileID
    //         profileData.location = req.body.data.location
    //         profileData.interests = req.body.data.interests
    //         profileData.geoLocation = req.body.geoLocation
    //         profileData.googleGeo = req.body.googleGeo
    //         // profileData.geoLocation.longitude = 333.3
    //         profileData.travelSchedule = req.body.data.travelSchedule
    //         profileData.save().then((data, err) => {

    //             if (err) {
    //                 return res.status(500).json(apiResponse.sendReply(0, 'Create Profile DB error'));
    //             } else {
    //                 return res.status(200).json(apiResponse.sendReply(1, 'profile created successfully', req.body.profileID));
    //             }

    //         })
    //     } catch (error) {
    //         apiResponse.reportError(error)
    //         return res.status(500).json(apiResponse.sendReply(0, 'Create Profile error'));
    //     }
    // })



}