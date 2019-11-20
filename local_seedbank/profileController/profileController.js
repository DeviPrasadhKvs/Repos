const fs = require('fs')
var path = require("path");
module.exports = (app, profileDataModel, apiResponse, preferencesModel, locationModel, notify) => {

    app.get('/testsocket/:pid', (req, res) => {
        profileID = req.params.pid
        notify.send(profileID, 'ref', 'test link mani')
        console.log(profileID)
        res.send('ok')
    })

    app.get('/profiles/:profileID', (req, res) => {
        try {
            profileID = req.params.profileID
            notify.send(profileID, 'test-search', { 1: 'test', 2: 'test2' })
            console.log(profileID)
            profileDataModel.aggregate([{
                    '$lookup': {
                        'from': 'preferences',
                        'localField': 'profileID',
                        'foreignField': 'profileID',
                        'as': 'preferencesDetails'
                    }
                },
                {
                    '$unwind': {
                        'path': '$preferencesDetails'
                    }
                },
                {
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
                },
                {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'preferencesDetails.profileImage',
                        'foreignField': 'imageID',
                        'as': 'profileImageData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'preferencesDetails.primaryImages',
                        'foreignField': 'imageID',
                        'as': 'primaryImageDetails'
                    }
                },
                {
                    '$lookup': {
                        'from': 'typeslists',
                        'localField': 'profileType',
                        'foreignField': 'typeID',
                        'as': 'profileTypes'
                    }
                }, {
                    '$lookup': {
                        'from': 'typeslists',
                        'localField': 'preferencesDetails.interests',
                        'foreignField': 'typeID',
                        'as': 'intrestsTypeData'
                    }
                }, {
                    '$match': {

                        '$and': [
                            { 'profileID': { '$ne': profileID } },
                            { 'preferencesDetails.blocked': { '$nin': [profileID] } },
                            { 'preferencesDetails.blockedBy': { '$nin': [profileID] } }
                        ]

                    }
                }

            ]).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'profiles fetched', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error fetching profiles'))
        }

    })

    app.get('/profile/:profileID', (req, res) => {
        try {
            let profileID = req.params.profileID

            profileDataModel.aggregate([{

                    '$lookup': {
                        'from': 'preferences',
                        'localField': 'profileID',
                        'foreignField': 'profileID',
                        'as': 'preferencesDetails'
                    }
                },
                {
                    '$unwind': {
                        'path': '$preferencesDetails'
                    }
                },
                {
                    '$lookup': {
                        'from': 'locations',
                        'localField': 'locationID',
                        'foreignField': 'locationID',
                        'as': 'locationDetails'
                    }
                },
                {
                    '$unwind': {
                        'path': '$locationDetails'
                    }
                },
                {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'preferencesDetails.profileImage',
                        'foreignField': 'imageID',
                        'as': 'profileImageData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'preferencesDetails.primaryImages',
                        'foreignField': 'imageID',
                        'as': 'primaryImageDetails'
                    }
                }, {
                    '$unwind': {
                        'path': '$locationDetails'
                    }
                }, {
                    '$lookup': {
                        'from': 'typeslists',
                        'localField': 'profileType',
                        'foreignField': 'typeID',
                        'as': 'profileTypes'
                    }
                }, {
                    '$lookup': {
                        'from': 'typeslists',
                        'localField': 'preferencesDetails.interests',
                        'foreignField': 'typeID',
                        'as': 'intrestsTypeData'
                    }
                },
                {
                    '$match': {

                        '$and': [
                            { 'profileID': { '$eq': profileID } },
                            { 'preferencesDetails.blocked': { '$nin': [profileID] } },
                            { 'preferencesDetails.blockedBy': { '$nin': [profileID] } }
                        ]

                    }
                }

            ]).then(data => {
                console.log(data)
                return res.status(200).send(apiResponse.sendReply(1, 'profiles fetched', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error fetching profiles'))
        }
    })


    app.get('/searchprofile/:name', (req, res) => {
        try {
            var name = req.params.name;
            profileDataModel.aggregate([{
                    '$match': {
                        'displayName': { $regex: name, $options: 'i' }
                    }
                },
                {
                    '$lookup': {
                        'from': 'preferences',
                        'localField': 'profileID',
                        'foreignField': 'profileID',
                        'as': 'preferencesData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$preferencesData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'locations',
                        'localField': 'locationID',
                        'foreignField': 'locationID',
                        'as': 'locationData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$locationData'
                    }
                },
                {
                    '$match': {
                        'locationData.enabled': true
                    }
                },
                {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'preferencesData.profileImage',
                        'foreignField': 'imageID',
                        'as': 'profileImageData'
                    }
                }, {
                    '$unwind': {
                        'path': '$profileImageData'
                    }
                }, {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'preferencesData.primaryImages',
                        'foreignField': 'imageID',
                        'as': 'primaryImagesData'
                    }
                }, {
                    '$unwind': {
                        'path': '$primaryImagesData'
                    }
                }

            ]).then((data, err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send(apiResponse.sendReply(1, "Error in DB while searching Profiles"))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, 'profile search success', data))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(1, "Error in DB while searching Profiles"))

        }

    })

    app.get('/getProfilesByLocation/:searchText', (req, res) => {
        try {
            locationModel.find({ $and: [{ 'city': { $regex: req.params.searchText.split(',').join("|"), $options: "i" } }, { 'country': { $regex: req.params.searchText.split(',').join("|"), $options: "i" } }] }, { locationID: true, _id: false }).then(data => {
                var b = []
                data.filter(ele => {
                    b.push(ele['locationID'])
                    return ele['locationID']
                })
                profileDataModel.aggregate([{
                        '$match': {
                            'locationID': { '$in': b }
                        }
                    },

                    {

                        '$lookup': {
                            'from': 'preferences',
                            'localField': 'profileID',
                            'foreignField': 'profileID',
                            'as': 'preferencesDetails'
                        }
                    },
                    {
                        '$unwind': {
                            'path': '$preferencesDetails'
                        }
                    },
                    {
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
                    },
                    {
                        '$lookup': {
                            'from': 'imageschemas',
                            'localField': 'preferencesDetails.profileImage',
                            'foreignField': 'imageID',
                            'as': 'profileImageData'
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'imageschemas',
                            'localField': 'preferencesDetails.primaryImages',
                            'foreignField': 'imageID',
                            'as': 'primaryImageDetails'
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'typeslists',
                            'localField': 'profileType',
                            'foreignField': 'typeID',
                            'as': 'profileTypes'
                        }
                    }, {
                        '$lookup': {
                            'from': 'typeslists',
                            'localField': 'preferencesDetails.interests',
                            'foreignField': 'typeID',
                            'as': 'intrestsTypeData'
                        }
                    }

                ]).then(data => {
                    return res.status(200).send(apiResponse.sendReply(1, 'profiles fetched', data))
                })

                //  res.send(b)
            })

            // locationModel.aggregate([{
            //     '$match': {
            //         '$or': [{ 'city': { $regex: req.params.searchText.split(',').join("|"), $options: "i" } }, { 'country': { $regex: req.params.searchText.split(',').join("|"), $options: "i" } }]
            //     }
            // }, {
            //     '$lookup': {
            //         'from': 'profiles',
            //         'localField': 'locationID',
            //         'foreignField': 'locationID',
            //         'as': 'profilesData'
            //     }
            // }, {
            //     '$unwind': {
            //         'path': '$profilesData'
            //     }
            // }, {
            //     '$lookup': {
            //         'from': 'preferences',
            //         'localField': 'profilesData.profileID',
            //         'foreignField': 'profileID',
            //         'as': 'preferencesData'
            //     }
            // }, {
            //     '$unwind': {
            //         'path': '$preferencesData'
            //     }
            // }, {
            //     '$lookup': {
            //         'from': 'imageschemas',
            //         'localField': 'preferencesData.profileImage',
            //         'foreignField': 'imageID',
            //         'as': 'profileImageData'
            //     }
            // }, {
            //     '$lookup': {
            //         'from': 'imageschemas',
            //         'localField': 'preferencesData.primaryImages',
            //         'foreignField': 'imageID',
            //         'as': 'primaryImagesData'
            //     }
            // }, {
            //     '$unwind': {
            //         'path': '$primaryImagesData'
            //     }
            // }]).then(data => {
            //     return res.status(200).send(apiResponse.sendReply(1, 'profile search by location success', data))
            // }).catch(e => {
            //     console.log(e)
            //     apiResponse.reportError(e)
            //     return res.status(500).send(apiResponse.sendReply(1, "Error while searching Profiles by location"))
            // })
        } catch (e) {
            console.log(e)
            reportError(e)
            return res.status(500).send(apiResponse.sendReply(1, "Error while searching Profiles by location"))
        }
    })

    app.get('/gettest', (req, res) => {
        profileDataModel.find({}, ('profileID location'), (err, data) => {
            if (err) {
                return res.status(500).send(apiResponse.sendReply(1, "Error in DB while searching Profiles"))
            } else {
                return res.status(200).send(apiResponse.sendReply(1, 'profile search success', data))
            }
        })
    })

    // app.post('/updateloc', (req, res) => {
    //     let profileID = req.body.profileID
    //     let locArray = req.body.locArray
    //     let lat = req.body.lat
    //     let long = req.body.long
    //     let googleGeo = {
    //         latitude: lat,
    //         longitude: long
    //     }
    //     console.log(req.body);


    //     profileDataModel.updateOne({ profileID }, { googleLocation: locArray, googleGeo }, (err, data) => {
    //         if (err) {
    //             return res.status(500).send(apiResponse.sendReply(1, "Error in DB while searching Profiles"))
    //         } else {
    //             return res.status(200).send(apiResponse.sendReply(1, 'profile search success'))
    //         }
    //     })
    // })

}