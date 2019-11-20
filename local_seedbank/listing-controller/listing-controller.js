const listingValidations = require('../validators/listingValidators')
var crypto = require('crypto');
var uniqid = require('uniqid');


module.exports = function product(app, listingModel, apiResponse, locationModel, calendarModel, preferencesModel) {


    app.post('/createListing', async(req, res) => {
        console.log('entered into post request');
        try {
            var savedData = []

            locationData = new locationModel()
            locationData.locationID = uniqid("LOC")
            locationData.profileID = req.body.profileID
            locationData.locationType = "LISTING"
            locationData.locationTypeCode = req.body.pinThisAs
            locationData.city = req.body.city
            locationData.country = req.body.country
            locationData.latitude = req.body.latitude
            locationData.longitude = req.body.longitude
            locationData.other = req.body.other
            locationData.save().then(locationdata => {
                savedData.push(locationdata)
                console.log('location data saved')
                console.log(locationdata.locationID)
                eventData = new calendarModel();
                eventData.eventID = uniqid("EVNT")
                eventData.title = req.body.title
                eventData.fromDate = req.body.fromDate;
                eventData.toDate = req.body.toDate
                eventData.fromTime = req.body.fromTime;
                eventData.toTime = req.body.toTime;
                eventData.description = req.body.description;
                eventData.locationID = locationdata.locationID
                eventData.eventType = req.body.eventType
                eventData.termsID = req.body.termsID
                eventData.profileID = req.body.profileID;
                eventData.save().then(eventdata => {
                    savedData.push(eventdata)
                    console.log('event data added')
                    console.log(eventdata.eventID)
                    listingData = listingModel()
                    listingData.listingID = crypto.createHash('md5').update(Date.now() + req.params.profileID + req.body.title).digest('hex');
                    listingData.tags = req.body.tags.split(",");
                    listingData.price = req.body.price;
                    listingData.eventID = eventdata.eventID
                    listingData.profileID = req.body.profileID
                    listingData.estimatedTime = (parseInt(req.body.hoursEstimate) * 60);
                    listingData.pinThisAs = req.body.pinThisAs
                    listingData.additionalDetails = req.body.additionalDetails;
                    listingData.imageArray = req.body.images
                    listingData.createdOn = req.body.createdOn
                    listingData.save().then(data => {
                        savedData.push(data)
                        console.log('listing added')
                        console.log(data.listingID)
                        return res.status(200).send(apiResponse.sendReply(1, 'Listing Data Saved', savedData));
                    })
                })
            })
        } catch (e) {
            console.log(e);
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, ' Error in create listing'));
        }
    })


    app.delete('/listing/', listingValidations.deleteListing(), async(req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }
            profileID = req.body.profileID
            listingID = req.body.listingID
            let deleteRes = await listingModel.deleteOne({
                $and: [{
                    listingID
                }, {
                    profileID
                }]
            });
            return res.status(200).json(apiResponse.sendReply(1, 'Listing Deleted'));
        } catch (e) {
            console.log(e);
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listing Deletion Error Occured'));
        }
    });

    app.get('/listing/:listingID', async(req, res) => {
        try {
            listingID = req.params.listingID
            listingModel.aggregate([{
                    '$match': {
                        'listingID': listingID
                    }
                },
                {
                    '$lookup': {
                        'from': 'calendars',
                        'localField': 'eventID',
                        'foreignField': 'eventID',
                        'as': 'eventData'
                    }
                }, {
                    '$unwind': {
                        'path': '$eventData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'locations',
                        'localField': 'eventData.locationID',
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
                    '$lookup': {
                        'from': 'typeslists',
                        'localField': 'pinThisAs',
                        'foreignField': 'typeID',
                        'as': 'typeData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$typeData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'profiles',
                        'localField': 'profileID',
                        'foreignField': 'profileID',
                        'as': 'profileData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$profileData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'locations',
                        'localField': 'profileData.locationID',
                        'foreignField': 'locationID',
                        'as': 'userLocationData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$userLocationData'
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
                        'from': 'imageschemas',
                        'localField': 'preferencesData.profileImage',
                        'foreignField': 'imageID',
                        'as': 'profileImage'
                    }
                },
                {
                    '$unwind': {
                        'path': '$profileImage'
                    }
                }


            ]).then(result => {
                listingModel.findOneAndUpdate({ listingID }, { $inc: { views: 1 } }).then(() => {
                    console.log('listing views are updated')
                })
                return res.status(200).json(apiResponse.sendReply(1, 'Got Listing Data', result));
            }).catch(e => {
                return res.status(500).json(apiResponse.sendReply(0, 'Listing Get by ID Error Occured'));
            })
        } catch (e) {
            apiResponse.reportError(e)
            console.log(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listing Get by ID Error Occured'));
        }

    });


    app.get('/listings', async(req, res) => {
        try {

            listingModel.aggregate([{
                    '$lookup': {
                        'from': 'calendars',
                        'localField': 'eventID',
                        'foreignField': 'eventID',
                        'as': 'eventData'
                    }
                }, {
                    '$unwind': {
                        'path': '$eventData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'locations',
                        'localField': 'eventData.locationID',
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
                    '$lookup': {
                        'from': 'typeslists',
                        'localField': 'pinThisAs',
                        'foreignField': 'typeID',
                        'as': 'typeData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$typeData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'profiles',
                        'localField': 'profileID',
                        'foreignField': 'profileID',
                        'as': 'profileData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$profileData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'locations',
                        'localField': 'profileData.locationID',
                        'foreignField': 'locationID',
                        'as': 'userLocationData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$userLocationData'
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
                        'from': 'imageschemas',
                        'localField': 'preferencesData.profileImage',
                        'foreignField': 'imageID',
                        'as': 'profileImage'
                    }
                },
                {
                    '$unwind': {
                        'path': '$profileImage'
                    }
                }
            ]).then(result => {
                return res.status(201).json(apiResponse.sendReply(1, 'got Listings Data', result));
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listings Get Error Occured'));
        }
    });


    app.post('/listingfilter', (req, res) => {
        var mymatch = {}

        if (req.body.listingType) {
            mymatch['listingType'] = req.body.listingType
        }
        if (req.body.tags) {
            mymatch['tags'] = { '$in': req.body.tags }
        }
        if (req.body.pinThisAs) {
            mymatch['pinThisAs'] = { '$in': req.body.pinThisAs | req.body.saleType }
        }

        var fromPrice = parseInt(req.body.fromPrice || 0)
        var toPrice = parseInt(req.body.toPrice || 10000000)
        mymatch['$and'] = [
            { "price": { '$gte': fromPrice } },
            { "price": { '$lte': toPrice } }
        ]

        // if (req.body.fromDate) {
        //     // mymatch['eventData.fromDate'] = {
        //     //     '$gte': req.body.fromDate
        //     // }
        //     fromDate = parseInt(req.body.fromDate)
        //     toDate = parseInt(req.body.toDate)
        //     mymatch['$or'] = [
        //         { 'fromDate': { '$gte': 1571219226 } },
        //         { 'toDate': { '$lte': 14712192265 } }
        //     ]
        // }
        // if (req.body.toDate) {
        //     mymatch['eventData.toDate'] = {
        //         '$lte': req.body.toDate
        //     }
        // }

        //console.log(mymatch)

        listingModel.aggregate([{
                    '$lookup': {
                        'from': 'calendars',
                        'localField': 'eventID',
                        'foreignField': 'eventID',
                        'as': 'eventData'
                    }
                }, {
                    '$unwind': {
                        'path': '$eventData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'locations',
                        'localField': 'eventData.locationID',
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
                    '$lookup': {
                        'from': 'typeslists',
                        'localField': 'pinThisAs',
                        'foreignField': 'typeID',
                        'as': 'typeData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$typeData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'profiles',
                        'localField': 'profileID',
                        'foreignField': 'profileID',
                        'as': 'profileData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$profileData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'locations',
                        'localField': 'profileData.locationID',
                        'foreignField': 'locationID',
                        'as': 'userLocationData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$userLocationData'
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
                        'from': 'imageschemas',
                        'localField': 'preferencesData.profileImage',
                        'foreignField': 'imageID',
                        'as': 'profileImage'
                    }
                },
                {
                    '$unwind': {
                        'path': '$profileImage'
                    }
                },
                {
                    '$project': {
                        // 'fromDate': "$eventData.fromDate",
                        // 'toDate': "$eventData.toDate",
                        // 'tags': 'tags',
                        // 'imageArray': 'imageArray',
                        // 'views': 'views',
                        // 'listingID': 'listingID',
                        // 'price': 'price',
                        // 'eventID': 'eventID',
                        // 'profileID': 'profileID',
                        // 'estimatedTime': 'estimatedTime',
                        // 'pinThisAs': 'pinThisAs',
                        // 'createdOn': 'createdOn',
                        // 'eventID': '$eventData.eventID',
                        // 'title': '$eventData.title',
                        // 'fromDate': '$eventData.fromDate',
                        // 'toDate': '$eventData.toDate',
                        // 'fromTime': '$eventData.fromTime',
                        // 'toTime': '$eventData.toTime',
                        // 'description': '$eventData.description',
                        // 'locationID': '$eventData.locationID',
                        // 'eventType': '$eventData.eventType',
                        'preferencesData': false

                    }
                },
                // {
                //     '$project': {
                //         'preferencesData': false,
                //     }
                // },
                {
                    '$match': mymatch
                },

            ])
            .then(data => {
                console.log(data)
                return res.status(201).json(apiResponse.sendReply(1, 'filtered listing data', data));

            }).catch(e => {
                console.log(e)
                return res.status(500).json(apiResponse.sendReply(0, 'Listings filters Error Occured', e));
            })


    });

    app.get('/searchListing/:searchText', async(req, res) => {
        try {
            var searchText = req.params.searchText;
            listingModel.aggregate([{
                    '$lookup': {
                        'from': 'calendars',
                        'localField': 'eventID',
                        'foreignField': 'eventID',
                        'as': 'eventData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$eventData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'locations',
                        'localField': 'eventData.locationID',
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
                        '$or': [{ 'eventData.title': { $regex: searchText, $options: "i" } }, { 'tags': { $regex: searchText, $options: "i" } }, { 'pinThisAs': { $regex: searchText, $options: "i" } }, { 'eventData.description': { $regex: searchText, $options: "i" } }]
                    }
                },
                {
                    '$project': {
                        // 'eventData.title': true,
                        'listingID': true,
                        title: '$eventData.title'

                    }
                }
            ]).then(data => {
                return res.status(201).json(apiResponse.sendReply(1, 'search listing data', data));
            }).catch(e => {
                console.log(e)
                return res.status(500).json(apiResponse.sendReply(0, 'Listings search  Error Occured', e));
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listings search  Error Occured', e));
        }
    })


    app.get('/getListingsByLocation/:searchText', (req, res) => {
        try {
            locationModel.aggregate([{
                    '$match': {
                        'locationType': "LISTING",
                        '$and': [
                            { 'city': { $regex: req.params.searchText.split(',').join("|"), $options: "i" } },
                            { 'country': { $regex: req.params.searchText.split(',').join("|"), $options: "i" } }
                        ]
                    }
                },
                {
                    '$lookup': {
                        'from': 'calendars',
                        'localField': 'locationID',
                        'foreignField': 'locationID',
                        'as': 'eventData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$eventData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'listings',
                        'localField': 'eventData.eventID',
                        'foreignField': 'eventID',
                        'as': 'listingData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$listingData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'profiles',
                        'localField': 'listingData.profileID',
                        'foreignField': 'profileID',
                        'as': 'profileData'
                    }
                }

            ]).then(data => {
                return res.status(201).json(apiResponse.sendReply(1, 'search listing by location successfull', data));
            }).catch(e => {
                console.log(e)
                return res.status(500).json(apiResponse.sendReply(0, 'Listings search  by location failed', e));

            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listings search  by location failed', e));
        }
    })


    app.get('/getListingsByID/:profileID', (req, res) => {
        try {
            listingModel.find({ profileID: req.params.profileID }).then(data => {
                return res.status(201).json(apiResponse.sendReply(1, 'Get listing by profileID is successfull', data));
            }).catch(e => {
                console.log(e)
                return res.status(500).json(apiResponse.sendReply(0, 'Get listing by profileID is failed', e));
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Get listing by profileID is failed', e));
        }
    })

    app.get('/getbyPins/:city/:country', (req, res) => {
        rcity = req.params.city
        rcountry = req.params.country
        try {
            locationModel.aggregate([{
                    '$match': {
                        locationType: "LISTING",
                        city: { $regex: rcity, $options: 'i' },
                        country: { $regex: rcountry, $options: 'i' }
                    }
                },
                {
                    '$group': {
                        _id: '$locationTypeCode',
                        count: { $sum: 1 }
                    }
                }

            ]).then(data => {
                console.log(data)
                return res.status(200).json(apiResponse.sendReply(1, 'pins data', data));

            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'error', e));
        }
    })

    app.get('/getPrice/:listingID', (req, res) => {
        try {
            listingModel.findOne({ listingID: req.params.listingID }).then(data => {
                field = 'editProfileView.' + data.pinThisAs + '.range.min';
                //console.log(data)
                preferencesModel.findOne({ profileID: data.profileID }, {
                    [field]: true
                }).then(preferencesData => {
                    console.log(data)
                    if (preferencesData == null) {
                        price = 10;
                        return res.status(200).json(apiResponse.sendReply(1, 'listing price fetched', { price }));
                    } else {
                        return res.status(200).json(apiResponse.sendReply(1, 'listing price fetched', { price: preferencesData.editProfileView[data.pinThisAs] ? preferencesData.editProfileView[data.pinThisAs].range.min : 10 }));
                    }
                    //console.log(preferencesData)
                })
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'error in getting listing price', e));
        }
    })

    app.get('/isInterestedMember/:profileId/:listingID', (req, res) => {
        try {
            listingModel.findOne({ listingID: req.params.listingID, interested: req.params.profileID }).then(data => {
                console.log(data)
                if (data == null) {
                    return res.status(200).json(apiResponse.sendReply(0, 'no interested member ', { data }));
                } else {
                    return res.status(200).json(apiResponse.sendReply(1, 'interested member fetched', { data }));
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'error in getting interested member', e));
        }
    })












}