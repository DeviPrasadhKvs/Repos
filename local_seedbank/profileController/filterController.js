var validator = require('validator');
var atob = require('atob')
module.exports = (app, profileData, apiResponse) => {

    app.post('/filters', (req, res) => {
        try {
            console.log(req.body);

            var mymatch = {}
            if (req.body.profileType) {
                mymatch['profileType'] = req.body.profileType
            }

            profileData.aggregate([{
                    '$match': mymatch
                },
                {
                    '$lookup': {
                        'from': 'preferences',
                        'localField': 'profileID',
                        'foreignField': 'profileID',
                        'as': 'preferencesDetails'
                    }
                }, {
                    '$unwind': {
                        'path': '$preferencesDetails'
                    }
                }, {
                    '$lookup': {
                        'from': 'locations',
                        'localField': 'locationID',
                        'foreignField': 'locationID',
                        'as': 'locationDetails'
                    }
                }, {
                    '$unwind': {
                        'path': '$locationDetails'
                    }
                }, {
                    '$match': {
                        'locationDetails.enabled': true
                    }
                }, {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'preferencesDetails.profileImage',
                        'foreignField': 'imageID',
                        'as': 'imageDetails'
                    }
                }, {
                    '$unwind': {
                        'path': '$imageDetails'
                    }
                }
            ]).then(data => {
                return res.status(201).json(apiResponse.sendReply(1, 'profile filter success', data));
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'profile filter failed', e));
        }







    })




}