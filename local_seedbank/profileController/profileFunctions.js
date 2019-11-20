var crypto = require('crypto');
//const request = require('request')
var uniqid = require('uniqid');

module.exports = (app, profileDataModel, apiResponse, termsModel, listingModel, KYCModel, imagesModel, statusModel, preferencesModel, calendarModel, locationModel, typesModel, tailorTerms) => {
    //new code ---------------------------------------------------
    app.get('/checkPayProcess/:member1/:member2', (req, res) => {
        profileDataModel.findOne({ profileID: req.params.member1 }).then((data) => {
            if (data != null) {
                profileDataModel.findOne({ profileID: req.params.member2 }).then((data2) => {
                    if (data2 != null) {
                        if (data.ima === data2.ima) {
                            return res.status(200).send(apiResponse.sendReply(1, 'doesnt require to pay', { payFlow: false }))
                        } else {
                            return res.status(200).send(apiResponse.sendReply(1, 'require to pay', { payFlow: true }))
                        }
                    } else {
                        return res.status(500).send(apiResponse.sendReply(0, 'internal error'))
                    }
                }).catch(error => {
                    console.log(error);

                    return res.status(500).send(apiResponse.sendReply(0, 'internal error'))
                })
            } else {
                return res.status(500).send(apiResponse.sendReply(0, 'internal error'))
            }
        }).catch(error => {
            console.log(error);

            return res.status(500).send(apiResponse.sendReply(0, 'internal error'))
        })
    })

    app.post('/setIdentificationImage', (req, res) => {

        try {

            imageID = uniqid('IMG')
            imageUrl = req.body.imageUrl
            imageType = "KYC"

            imagesModel.findOneAndUpdate({ $and: [{ profileID: req.body.profileID }, { imageType: "KYC" }] }, { imageID, imageUrl }, { upsert: true, new: true }).then(data => {
                console.log('KYC image added to images database')
                KYCModel.findOneAndUpdate({ profileID: req.body.profileID }, { imageID, imageStatus: "PENDING" }, { upsert: true, new: true }).then(kycData => {
                    console.log('kyc details added successfully')
                    return res.status(200).send(apiResponse.sendReply(1, "KYC details added successfully", kycData))
                }).catch(err => {
                    return res.status(500).send(apiResponse.sendReply(0, "error in adding KYC details", e))
                })
            }).catch(e => {
                console.log('error in Kyc image storing')
                return res.status(500).send(apiResponse.sendReply(0, "error in KYC image storing", e))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }

    })

    // CMS api's for ID verification -----------------------------------------
    app.get('/getUnverifiedProfiles', (req, res) => {
        KYCModel.find({ imageStatus: "PENDING" }, { profileID: 1 }).then(data => {
            return res.status(200).send(apiResponse.sendReply(1, 'profiles need to be verifed fetched ', data))
        }).catch(e => {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in fetching profiles need to be verified', e))
        })
    })
    app.get('/getIdentificationDetails/:profileID', (req, res) => {
        try {
            KYCModel.findOne({ profileID: req.params.profileID }, { imageStatus: true, verification: true }).then(data => {
                console.log(data);
                if (data != null) {
                    return res.status(200).send(apiResponse.sendReply(1, 'profile need to be verifed fetched ', data))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, 'profile need to be verifed fetched ', {
                        imageStatus: false,
                        verification: false
                    }))
                }
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error in fetching profile need to be verified', e))
            })
        } catch (e) {
            apiResponse.reportError(e)
        }
    })
    app.get('/approveIdentification/:profileID', (req, res) => {
        try {
            KYCModel.findOneAndUpdate({ profileID: req.params.profileID }, { imageStatus: "APPROVED", verification: true }).then((data) => {
                //console.log('profile approved ' + data.profileID)
                console.log(data)
                statusModel.findOneAndUpdate({ profileID: req.params.profileID }, { activationStatus: true }, { upsert: true, new: true }).then(() => {
                    console.log('verification changed succesfully')
                }).catch(e => {
                    console.log('error in changing verification status')
                })
                return res.status(200).send(apiResponse.sendReply(1, 'profile approved ' + data.profileID))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error in approving profile', e))
            })
        } catch (e) {
            apiResponse.reportError(e)
        }
    })

    app.post('/rejectIdentification/:profileID', (req, res) => {
        try {
            KYCModel.findOneAndUpdate({ $and: [{ profileID: req.params.profileID }, { verification: "PENDING" }] }, { imageStatus: "REJECTED", verification: false, rejectReason: req.body.reason }).then(data => {
                if (data) {
                    return res.status(200).send(apiResponse.sendReply(1, 'profile rejected for reason: ' + req.body.reason, data))
                } else {
                    return res.status(500).send(apiResponse.sendReply(0, 'Invalid Request for this profile'))
                }

            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error in rejecting profile', e))
            })
        } catch (e) {
            apiResponse.reportError(e)
        }
    })

    app.get('/identityUploadStatus/:profileID', (req, res) => {
        try {
            KYCModel.findOne({ profileID: req.params.profileID }, { imageUpload }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'Identify image upload status', data))
            })
        } catch (e) {
            apiResponse.reportError(e)
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in rejecting profile', e))
        }
    })

    //calendar api's-----------------------------------------------
    app.post('/setweekinfo', (req, res) => {
        try {
            console.log(req.body);
            let profileID = req.body.profileID
                // let weekdays = req.body.weekdays
                // let weekTime = req.body.weekTime
            let calendarData = req.body.calendarData

            preferencesModel.findOneAndUpdate({ profileID }, { weekCalendar: calendarData }, { upsert: true, new: true }, (err, data) => {
                if (err) {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in setting weekinfo'))
                } else {
                    statusModel.findOneAndUpdate({ profileID }, { calendarStatus: true }, { upsert: true }).then(() => {
                        console.log('calendar status changed')
                        return res.status(200).send(apiResponse.sendReply(1, 'weekinfo set successfully', data))
                    })

                }
            })
        } catch (e) {
            apiResponse.reportError(e)
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in setting weekinfo'))
        }
    })
    app.get('/getweekinfo/:profileID', (req, res) => {
        try {
            let profileID = req.params.profileID
            preferencesModel.findOne({ profileID }, ('weekCalendar'), (err, data) => {
                if (err) {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in getting weekinfo'))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, 'weekinfo get successfully', data))
                }
            })
        } catch (e) {
            apiResponse.reportError(e)
        }
    })
    app.post('/createEvent', (req, res) => {
        try {
            console.log(req.body);
            locationData = new locationModel()
            locationData.locationID = uniqid("LOC")
            locationData.city = req.body.city
            locationData.country = req.body.country
            locationData.latitude = req.body.latitude
            locationData.longitude = req.body.longitude
            locationData.locationType = req.body.locationType
            locationData.profileID = req.body.profileID
            locationData.locationTypeCode = req.body.profileType
            locationData.save().then(locData => {
                console.log(locData)
                eventData = new calendarModel()
                eventData.locationID = locData.locationID
                eventData.profileID = req.body.profileID
                eventData.eventID = uniqid('EVT')
                eventData.profileType = req.body.profileType
                eventData.fromDate = req.body.scheduleFrom
                eventData.toDate = req.body.scheduleTo
                eventData.toTime = req.body.toTime
                eventData.fromTime = req.body.fromTime
                eventData.eventType = req.body.type
                eventData.title = req.body.title
                eventData.description = req.body.description
                eventData.termsID = req.body.termsID

                eventData.save().then(data => {
                    console.log('calendar event added Successfully')
                    return res.status(200).send(apiResponse.sendReply(1, 'calendar event added Successfully', data))
                }).catch(e => {
                    console.log(e)
                    return res.status(500).send(apiResponse.sendReply(0, 'error in adding event data', e))
                })

            })

        } catch (error) {
            console.log(error);
            apiResponse.reportError(error)
            return res.status(500).send(apiResponse.sendReply(0, 'error in adding event data', e))
        }
    })
    app.post('/addLocation', (req, res) => {
        try {
            locationData = new locationModel()
            locationData.locationID = uniqid("LOC")
            locationData.city = req.body.city
            locationData.country = req.body.country
            locationData.latitude = req.body.latitude
            locationData.longitude = req.body.longitude
            locationData.locationType = req.body.locationType
            locationData.profileID = req.body.profileID
            locationData.locationTypeCode = req.body.locationTypeCode
            locationData.save().then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'location added Successfully', data))
            })

        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in adding location data', e))
        }
    })

    app.get('/checkDateConflict/:profileID/:fromDate/:toDate', (req, res) => {
        try {
            profileID = req.params.profileID
            fromDate = req.params.fromDate
            toDate = req.params.toDate
            calendarModel.find({ $and: [{ profileID: req.params.profileID }, { fromDate: { $gt: fromDate } }, { toDate: { $lt: toDate } }] }).count().then(data => {
                console.log('count of conflict dates' + data)
                if (count > 0) {
                    return res.status(500).send(apiResponse.sendReply(0, "sorry, dates conflicting", data))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, "no conflicting dates found", data))
                }
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, "error in checking date conflicts"))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, "error in checking date conflicts"))
        }
    })


    app.delete('/deleteEvent/:eventID', (req, res) => {
        try {
            calendarModel.findOneAndDelete({ eventID: req.params.eventID }).then(data => {
                console.log('event deleted from calendar eventID:' + req.params.eventID)
                return res.status(200).send(apiResponse.sendReply(1, 'calendar event Deleted Successfully', data))
            }).catch(e => {
                console.log('error in deleting eventID: ' + req.params.eventID)
                return res.status(500).send(apiResponse.sendReply(0, 'error in deleting eventID'))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })

    app.get('/getevents/:profileID', (req, res) => {
        try {
            let profileID = req.params.profileID
            calendarModel.aggregate([{
                    '$match': {
                        'profileID': profileID
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
                }
            ]).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'Events List fetched successfully', data))
            })

        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })
    app.get('/getevents', (req, res) => {
        try {
            // let profileID = req.params.profileID
            calendarModel.aggregate([
                // {
                //     '$match': {
                //         'profileID': profileID
                //     }
                // },
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
                }
            ]).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'Events List fetched successfully', data))
            })

        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })

    app.get('/getupcommingevents/:profileID', (req, res) => {
        try {
            calendarModel.find({ $and: [{ profileID: req.params.profileID }, { fromDate: { $gt: new Date().getTime() } }] }).then(data => {
                console.log('upcomming events fetched')
                return res.status(200).send(apiResponse.sendReply(1, 'upcomming events list fetched successfully', data))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error in fetching upcomming events', e))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })

    // image API's------------------------------------------

    app.post('/setGroupImages', async(req, res) => {
        console.log(req.body)
        try {
            profileID = req.params.profileID
            imageUrls = req.body.images.split(",")
            let uploadedData = [];
            // imageUpload(){

            // }
            var upload = new Promise((resolve, reject) => {
                imageUrls.forEach(imageDetails => {
                    let images = new imagesModel()
                    images.imageID = uniqid("IMG")
                    images.imageUrl = imageDetails
                    images.imageType = req.body.imageType
                    images.profileID = req.body.profileID
                    images.save().then(data => {
                        console.log('image saved imageID: ' + data.imageID)
                        uploadedData.push(data.imageID)
                        if (uploadedData.length === imageUrls.length) {
                            resolve(uploadedData)
                        }
                    })


                })

            })
            upload.then(d => {
                console.log('images added')
                return res.status(200).send(apiResponse.sendReply(1, 'image details updated successfully', d))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })

    app.get('/getImage/:imageID', (req, res) => {
        try {
            imagesModel.findOne({ imageID: req.params.imageID }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'image details fetched', data))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error in fetching image details', e))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })

    app.get('/getImageByIDs/:imageIDS', (req, res) => {
        try {
            imagesModel.find({ imageID: { $in: req.params.imageIDS.split(',') } }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'image details fetched', data))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error in fetching image details', e))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in fetching image details', e))
        }
    })



    // preferences & account details --------------------------------------------
    app.post('/setphonenumber/:profileID', (req, res) => {
        try {
            console.log(req.body);
            let profileID = req.params.profileID
            let phoneNumber = req.body.phoneNumber

            profileDataModel.updateOne({ profileID }, { phoneNumber }, (err, data) => {
                if (err) {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in setting phoneNumber'))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, 'phoneNumber set successfully', data))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in setting phoneNumber'))
        }
    })

    app.get('/jury/:profileID/:status', (req, res) => {
        try {
            let profileID = req.params.profileID
            let status = req.params.status
            preferencesModel.findOneAndUpdate({ profileID }, { juryMember: status }, { upsert: true, new: true }, (err, data) => {
                if (err) {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in setting jury'))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, 'Jury set successfully'))
                }
            })
        } catch (e) {
            console.log(e);
            apiResponse.reportError(e)
        }
    })

    app.get('/getjury/:profileID', (req, res) => {
        let profileID = req.params.profileID
        preferencesModel.findOne({ profileID }, { juryMember: 1 }, (err, data) => {
            if (err) {
                return res.status(500).send(apiResponse.sendReply(0, 'error in setting jury'))
            } else {
                return res.status(200).send(apiResponse.sendReply(1, 'Jury set successfully', data))
            }
        })
    })

    app.get('/autoNotifications/:profileID/:status', (req, res) => {
        try {
            let profileID = req.params.profileID
            let status = req.params.status
            preferencesModel.findOneAndUpdate({ profileID }, { enableAutoNotifications: status }, { upsert: true, new: true }, (err, data) => {
                if (err) {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in setting status'))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, 'notification status changed successfully'))
                }
            })
        } catch (e) {
            console.log(e);
            apiResponse.reportError(e)
        }
    })

    app.get('/getautoNotificationStatus/:profileID', (req, res) => {
        let profileID = req.params.profileID
        preferencesModel.findOne({ profileID }, { enableAutoNotifications: 1 }, (err, data) => {
            if (err) {
                return res.status(500).send(apiResponse.sendReply(0, 'error in getting status'))
            } else {
                return res.status(200).send(apiResponse.sendReply(1, 'notification status fetched', data))
            }
        })
    })

    app.post('/setprofileimage', (req, res) => {
        try {
            console.log(req.body);
            let imageID
            if (req.body.imageID === "DEFAULT" || req.body.imageID == null) {
                imageID = uniqid('IMG')
            } else {
                imageID = req.body.imageID
            }
            profileID = req.body.profileID
            imageUrl = req.body.profileImage
            imageType = "PROFILE-IMGAGE"
            console.log(imageID)
            imagesModel.findOneAndUpdate({ imageID: imageID }, { imageUrl, profileID, imageType }, { upsert: true, new: true }).then((d) => {
                console.log('profile image saved')
                console.log(d)
                statusModel.findOneAndUpdate({ profileID }, { profileImageSet: true }, { upsert: true, new: true }).then(() => {
                    console.log('profile imageset status changed')
                    preferencesModel.findOneAndUpdate({ profileID }, { profileImage: imageID }, { upsert: true, new: true }).then(profileImageData => {
                        console.log('profile picture updated')
                        return res.status(200).send(apiResponse.sendReply(1, 'profileImage set successfully', profileImageData))
                    })

                }).catch(e => {
                    console.log(e)
                })

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })

    app.get('/getprofileinfo/:profileID', (req, res) => {
        try {
            let profileID = req.params.profileID
            profileDataModel.aggregate([{
                    '$match': {
                        'profileID': profileID
                    }
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
                console.log(data);
                profileDataModel.findOneAndUpdate({ profileID }, { $inc: { profileViews: 1 } }).then(() => {
                    console.log('views count updted by 1')
                    res.send(data)
                }).catch(e => {
                    apiResponse.reportError(e)
                    console.log(e)
                    console.log('some error while updating profile views')
                })
            })

        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in getting profileinfo'))
        }
    })

    app.post('/setprofileinfo', (req, res) => {
        try {
            let profileID = req.body.profileID
            let gender = req.body.gender
            let displayName = req.body.displayName
            locationInfo = new locationModel()
            locationInfo.locationID = uniqid('LOC')
            locationInfo.profileID = profileID
            locationInfo.city = req.body.city
            locationInfo.country = req.body.country
            locationInfo.latitude = req.body.latitude
            locationInfo.longitude = req.body.longitude
            locationInfo.other = req.body.other
            locationInfo.locationType = "USERLOCATION"
            locationInfo.locationTypeCode = "CURRENT"
            locationInfo.enabled = true

            console.log(req.body);
            profileDataModel.updateOne({ profileID }, { gender, displayName, locationID: locationInfo.locationID }, (err, data) => {
                if (err) {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in setting profileImage'))
                } else {
                    console.log(data);
                    locationInfo.save().then(locationData => {
                        console.log('location data updated successfully')
                        return res.status(200).send(apiResponse.sendReply(1, 'profile info updated successfully', { data, locationData }))
                    }).catch(e => {
                        console.log('error in uppdatiing location details')
                        console.log(e)
                        apiResponse.reportError(e)
                    })
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in updating profileinfo'))

        }
    })

    app.post('/setlocationdetails/profileID', (req, res) => {
        try {
            let city = req.body.city
            let country = req.body.country
            let latitude = req.body.latitude
            let longitude = req.body.longitude
            let other = req.body.other
            let locationType = req.body.locationType
            let profileID = req.params.profileID

            locationModel.findOneAndUpdate({ profileID }, { city, country, latitude, longitude, other, locationType }, { upsert: true, new: true }).then(data => {
                console.log('location details fetched successfully')
                return res.status(200).send(apiResponse.sendReply(1, 'location details updated', data))
            }).catch(e => {
                console.log(e)
                apiResponse.reportError(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error in updating location details'))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }

    })

    app.post('/updateinterests', (req, res) => {
        try {
            console.log(req.body);
            let profileID = req.body.profileID
            let interests = req.body.interests
            preferencesModel.findOneAndUpdate({ profileID }, { interests: interests }, { upsert: true, new: true }, (err, data) => {
                if (err) {
                    apiResponse.reportError(e)
                    return res.status(500).send(apiResponse.sendReply(0, 'error in setting intrests'))
                } else {
                    console.log(data);
                    return res.status(200).send(apiResponse.sendReply(1, 'intrests set successfully'))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })

    app.get('/verifyMatureType/:profileID', (req, res) => {

        let profileID = req.params.profileID
        preferencesModel.findOne({ profileID, interests: { $in: ["PRO-BRTCLBQZ"] } }).then(data => {
            if (data != null) {
                return res.status(200).send(apiResponse.sendReply(1, 'fetched', { matureContent: true }))
            } else {
                return res.status(200).send(apiResponse.sendReply(1, 'fetched', { matureContent: false }))
            }
        }).catch((data) => {
            return res.status(500).send(apiResponse.sendReply(0, 'internal error'))
            apiResponse.reportError(data)
        })
    })

    app.get('/singleget/:profileID', (req, res) => {

        let profileID = req.params.profileID
        let field = req.query.field
        profileDataModel.findOne({ profileID }, (field.toString()), (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send(apiResponse.sendReply(0, 'error in getting data'))
            } else {
                console.log(data);
                return res.status(200).send(apiResponse.sendReply(1, 'data set successfully', data))
            }
        })
    })

    app.get('/getTypes/:type', (req, res) => {
        try {
            console.log(req.params);
            typesModel.find({ type: req.params.type.toUpperCase() }).then(data => {
                console.log(data)
                return res.status(200).send(apiResponse.sendReply(1, 'types fetched', data))
            })
        } catch (e) {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'types cant fetch'))
        }

    })


    app.get('/getTypesById/:types', (req, res) => {
        try {
            console.log(req.params);
            typesModel.find({ typeID: { $in: req.params.types.split(',') } }).then((data) => {
                console.log(data);
                return res.status(200).send(apiResponse.sendReply(1, 'types fetched', data))
            })
        } catch (e) {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'types cant fetch'))
        }

    })

    app.post('/setsign/:profileID', (req, res) => {
        try {
            let profileID = req.params.profileID
            console.log(req.body);
            let signatureSVG = req.body.signatureSVG
            preferencesModel.findOneAndUpdate({ profileID }, { signatureSVG }, { upsert: true, new: true }, (err, data) => {
                statusModel.findOneAndUpdate({ profileID }, { signatureSet: true }, { upsert: true, new: true }).then(() => {
                    console.log('svg status changed')
                }).catch(e => {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in updating signatureSVG status'))
                })
                if (err) {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in setting signatureSVG'))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, ' set signatureSVG'))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })


    //---------Mani Code ----------------------
    //------------------------------------
    app.get('/setAllowMatureContent/:profileID', (req, res) => {
        try {
            let profileID = req.params.profileID
            preferencesModel.findOneAndUpdate({ profileID }, { allowMature: true }, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send(apiResponse.sendReply(0, 'error in updating mature content'));
                } else {
                    console.log(data);
                    return res.status(200).send(apiResponse.sendReply(1, 'set successfully'));
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    });

    app.get('/allowMatureContent/:profileID', (req, res) => {
        try {
            let profileID = req.params.profileID
            preferencesModel.findOne({ profileID }, { allowMature: 1 }, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send(apiResponse.sendReply(0, 'error in getting mature content'));
                } else {
                    console.log(data);
                    return res.status(200).send(apiResponse.sendReply(1, 'data get successfully', data));
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    });

    app.post('/editProfileView/:profileID', (req, res) => {
        try {
            let profileID = req.params.profileID
            let profileType = 'editProfileView.' + req.body.profileType
            var data = {
                _id: req.body.profileType,
                range: {
                    min: req.body.rangeMin || 0,
                    max: req.body.rangeMax || 0
                },
                time: {
                    from: req.body.fromTime || Date.now(),
                    to: req.body.toTime || Date.now()
                },
                experience: {
                    duration: req.body.experience ? req.body.experience.split(' ')[0] : '0',
                    period: req.body.experience ? req.body.experience.split(' ')[1] : 'Days'
                },
                imageLinks: req.body.images.split(',')
            }
            preferencesModel.findOneAndUpdate({ profileID }, {
                $set: {
                    [profileType]: data
                }
            }, (err, d) => {
                if (err) {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in updatingDetails ', err))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, 'details updated'))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })
    app.get('/editProfileView/:profileID', (req, res) => {
        try {
            let profileID = req.params.profileID

            preferencesModel.findOne({ profileID }, { editProfileView: 1 }, (err, data) => {
                if (err) {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in getting edit profile Details '))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, 'edit profile details get successfully', data))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })


    app.get('/getProfileCompletionStatus/:profileID', (req, res) => {
        try {
            statusModel.findOne({ profileID: req.params.profileID }).then(data => {
                if (data)
                    return res.status(200).send(apiResponse.sendReply(1, 'Profile completion status', data))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error while fetching profile completion details'))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }

    })

    app.get('/setActivationStatus/:profileID', (req, res) => {
        try {
            statusModel.findOneAndUpdate({ profileID: req.params.profileID }, { activationStatus: true }).then(() => {
                return res.status(200).send(apiResponse.sendReply(1, 'Activation status updated'))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error while setting Activation Status'))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })

    app.get('/setCardsStatus/:profileID/:status', (req, res) => {
        try {
            statusModel.findOneAndUpdate({ profileID: req.params.profileID }, { cardsStatus: req.params.status }).then(() => {
                return res.status(200).send(apiResponse.sendReply(1, 'cards status updated'))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error while setting cards Status'))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })

    app.get('/setCalendarStatus/:profileID/:status', (req, res) => {
        try {
            statusModel.findOneAndUpdate({ profileID: req.params.profileID }, { calendarStatus: req.params.status }).then(() => {
                return res.status(200).send(apiResponse.sendReply(1, 'calendar status updated'))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error while setting calendar Status'))
            })
        } catch (e) {
            console.log(e)
            apiResponse.sendReply(e)
        }
    })

    app.get('/setPayoutStatus/:profileID/:status', (req, res) => {
        try {
            statusModel.findOneAndUpdate({ profileID: req.params.profileID }, { payoutStatus: req.params.status }).then(() => {
                return res.status(200).send(apiResponse.sendReply(1, 'payout status updated'))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error while setting payout Status'))
            })
        } catch (e) {
            console.log(e)
            apiResponse.sendReply(e)
        }
    })

    app.get('/setKYCImageVerify/:profileID/:status', (req, res) => {
        try {
            KYCModel.findOneAndUpdate({ profileID: req.params.profileID }, { verification: req.params.status }).then(() => {
                return res.status(200).send(apiResponse.sendReply(1, 'identificationImageVerification status updated'))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error while setting identificationImageVerification Status'))
            })
        } catch (e) {
            console.log(e)
            apiResponse.sendReply(e)
        }
    })




    app.post('/setTailorTerms', (req, res) => {
        console.log(req.body);
        let profileID = req.body.profileID
        let termsType = req.body.termsType
        let termsID = req.body.termsID || uniqid("TERM")
        let terms = req.body.terms

        tailorTerms.updateOne({ termsID }, { termsType, termsID, terms, profileID }, { upsert: true, new: true }, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send(apiResponse.sendReply(0, 'error in setting terms'))
            } else {
                console.log(data);
                return res.status(200).send(apiResponse.sendReply(1, 'terms set successfully', termsID))
            }
        })
    })

    app.get('/getTailorTerms/:profileID', (req, res) => {
        let profileID = req.params.profileID
        tailorTerms.find({ profileID }, (err, data) => {
            if (err) {
                return res.status(500).send(apiResponse.sendReply(0, 'error in getting terms'))
            } else {
                return res.status(200).send(apiResponse.sendReply(1, 'terms get successfully', data))
            }
        })
    })


    app.get('/fetchAllImages/:profileID', async(req, res) => {
        let profileID = req.params.profileID
        let mydata = []
        profileDataModel.aggregate([{
            '$match': {
                'profileID': profileID
            }
        }, {
            '$project': {
                'data': { '$objectToArray': '$editProfileView' }
            }
        }, {
            '$project': {
                'data': { "v": { 'imageLinks': 1 } }
            }
        }, {
            '$project': {
                'data': '$data.v.imageLinks'
            }
        }]).then(data => {
            console.log(data[0].data);

            let mydata = []
            if (data[0].data) {
                data[0].data.forEach(element => {
                    //console.log(mydata)
                    mydata = mydata.concat(element)
                        //console.log(mydata)
                });
                listingModel.findOne({ profileID }, { imageArray: true }).then(result => {
                    if (result != null) {
                        mydata = mydata.concat(result.imageArray)
                    }
                    return res.status(200).send(apiResponse.sendReply(1, 'images get successfully', mydata))
                }).catch(e => {
                    return res.status(500).send(apiResponse.sendReply(0, 'error in getting listing images', e))
                })

            } else {
                return res.status(200).send(apiResponse.sendReply(1, 'no images found'))
            }

        }).catch(e => {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in getting edit profile view images', e))

        })

    })

    //bookmarked api's
    app.post('/bookmarkImage/:profileID/', (req, res) => {
        try {
            imageDetails = new boo()
            imageDetails.imageID = uniqid("IMG")
            imageDetails.imageUrl = req.body.imageUrl
            imageDetails.imageType = req.body.imageType
            imageDetails.profileID = req.params.profileID
            imageDetails.save().then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'image bookmarked', data))
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error in bookmarking image', e))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
        }
    })

    app.get('/bookmarkedImages/:profileID/', (req, res) => {
        imagesModel.findOne({ $and: [{ profileID: req.params.profileID }, { imageType: "LISTING" }] }).then(data => {
            return res.status(200).send(apiResponse.sendReply(1, 'images bookmarked fetched successfull', data))
        }).catch(e => {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in fetching bookmarked images', e))
        })
    })

    //calendar api's
    app.get('/getProfileType/:profileID', (req, res) => {
        profileDataModel.findOne({ profileID: req.params.profileID }, { profileType: 1 }).then(data => {
            return res.status(200).send(apiResponse.sendReply(1, 'profile types fetched ', data.profileType.split(",")))
        }).catch(e => {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in fetching profile types', e))
        })
    })

    //personal galary
    app.post('/addGalleryImages', (req, res) => {
        try {
            profileID = req.body.profileID
            images = req.body.imageUrls
            var length = images.length
            var countLength = 0;
            var uploadedImages = []
            images.forEach(image => {
                personalImages = new imagesModel()
                personalImages.imageID = uniqid("IMG")
                personalImages.imageUrl = image
                personalImages.imageType = "GALLERY"
                personalImages.profileID = req.body.profileID
                personalImages.save().then(data => {
                    // console.log(data)
                    uploadedImages.push(data)
                    countLength = countLength + 1
                    console.log(countLength)
                    console.log(length)
                    if (countLength >= length) {
                        console.log('all images are uploaded successfully')
                        return res.status(200).send(apiResponse.sendReply(1, 'images uploaded', uploadedImages))
                    }
                })
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in images uploaded', e))
        }
    })

    app.get('/getGalleryImages/:profileID', (req, res) => {
        try {
            imagesModel.find({ $and: [{ profileID: req.params.profileID }, { imageType: "GALLERY" }] }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'images fetched', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in fetching images', e))
        }
    })

    app.get('/deleteImage/:imageID', (req, res) => {
        try {
            imagesModel.findOneAndDelete({ imageID: req.params.imageID }).then(data => {
                console.log('image deleted')
                return res.status(200).send(apiResponse.sendReply(1, 'image deleted', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in deleting image', e))
        }
    })


    app.get('/makePrimaryImage/:profileID/:imageID', (req, res) => {
        try {
            profileID = req.params.profileID
            imageID = req.params.imageID
            preferencesModel.findOne({ profileID }, { primaryImages: true }).then(arraydata => {
                if (arraydata.primaryImages.length >= 3) {
                    preferencesModel.findOneAndUpdate({ profileID }, { $pop: { primaryImages: -1 } }).then(() => {
                        preferencesModel.findOneAndUpdate({ profileID }, { $push: { primaryImages: imageID } }).then(data => {
                            console.log(data)
                            return res.status(200).send(apiResponse.sendReply(1, 'image added to primary images', data))
                        }).catch(e => {
                            console.log(e)
                            apiResponse.reportError(e)
                            return res.status(500).send(apiResponse.sendReply(0, 'error poping primary images', e))
                        })
                    })
                } else {
                    preferencesModel.findOneAndUpdate({ profileID }, { $push: { primaryImages: imageID } }).then(data => {
                        console.log(data)
                        return res.status(200).send(apiResponse.sendReply(1, 'image added to primary images', data))
                    })
                }
            })

        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in making primary images', e))
        }
    })

    app.get('/getPrimaryImages/:profileID', (req, res) => {
        try {
            profileID = req.params.profileID
            preferencesModel.aggregate([{
                    '$match': {
                        'profileID': profileID
                    }
                },
                {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'primaryImages',
                        'foreignField': 'imageID',
                        'as': 'imageUrls'
                    }
                }
            ]).then(data => {
                console.log(data)
                return res.status(200).send(apiResponse.sendReply(1, 'primary images fetched', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in getting primary images', e))

        }
    })

    app.get('/removePrimaryImage/:profileID/:imageID', (req, res) => {
        try {
            preferencesModel.findOneAndUpdate({ profileID: req.params.profileID }, { $pull: { primaryImages: req.params.imageID } }).then(data => {
                console.log('primary image removed')
                return res.status(200).send(apiResponse.sendReply(1, 'primary images removed', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in removing primary images', e))
        }
    })





    app.get('/gettermstatus/:profileID', (req, res) => {
        let profileID = req.params.profileID
        console.log(profileID);

        profileDataModel.findOne({ profileID }, ('termSet settingsProgress'), (err, data) => {
            if (err) {
                console.log(err);
                apiResponse.reportError(err)
                return res.status(500).send(apiResponse.sendReply(0, "status not fetched"))
            } else {
                console.log(data);
                return res.status(200).send(apiResponse.sendReply(1, "status fetched", data))

            }
        })
    })

    app.get('/getProfileLocations/:profileID', (req, res) => {
        try {
            locationModel.aggregate([{
                    '$match': {
                        'profileID': req.params.profileID,
                        'locationType': { $ne: "USERLOCATION" }
                    }
                }])
                .then(data => {
                    console.log(data)
                    return res.status(200).send(apiResponse.sendReply(1, "status fetched", data))
                })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, "error in gettting profile locations"))

        }
    })


    app.get('/whoIS/:profileID', (req, res) => {
        try {
            profileDataModel.findOne({ profileID: req.params.profileID }).then(data => {
                if (data != null) {
                    if (data.ima === "IM-SHZNDTFR") {
                        return res.status(200).send(apiResponse.sendReply(1, "this is member profile", { isMember: true, data }))
                    } else if (data.ima === "IM-MTMZFZZO") {
                        return res.status(200).send(apiResponse.sendReply(1, "this is artist profile", { isMember: false, data }))
                    } else {
                        return res.status(200).send(apiResponse.sendReply(1, "fetched  profileType data", data))
                    }
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, "No Data found"))
                }

            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, "error in checking whoIS", e))
        }
    })

    app.get('/getMinPrice/:profileID/:typeID', (req, res) => {
        try {
            field = 'editProfileView.' + req.params.typeID + '.range.min';

            preferencesModel.findOne({ profileID: req.params.profileID }, {
                [field]: true
            }).then(data => {
                console.log(data)
                return res.status(200).send(apiResponse.sendReply(1, "fetched  min price", data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, "error getting min price", e))
        }
    })

    app.get('/addToInterested/:listingID/:profileID', (req, res) => {
        try {
            listingModel.findOneAndUpdate({ listingID: req.params.listingID }, { $push: { interested: req.params.profileID }, $inc: { interestedCount: 1 } }, { new: true }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, "added to interested lists", data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, "error adding to interested list", e))
        }
    })

    //suspend account
    app.get('/suspendAccount/:profileID', (req, res) => {
        try {
            profileDataModel.findOneAndUpdate({ profileID: req.params.profileID }, { suspended: true }, { new: true }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, "account suspended", data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, "error suspending account", e))
        }
    })

    app.get('/revokeAccount/:profileID', (req, res) => {
        try {
            profileDataModel.findOneAndUpdate({ profileID: req.params.profileID }, { suspended: false }, { new: true }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, "account reactivated", data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, "error in reactivating account", e))
        }
    })




}