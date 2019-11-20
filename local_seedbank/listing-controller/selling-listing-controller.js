const listingValidations = require('../validators/listingValidators')
var crypto = require('crypto');


module.exports = function product(app, sellingListingModel, apiResponse, validationResult) {


    app.post('/selling-listing/:profileID', async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }
            console.log(req.body.imageArray);
            let listing = new sellingListingModel();

            listing.listingID = crypto.createHash('md5').update(Date.now() + req.params.profileID + req.body.title).digest('hex');
            listing.profileID = req.params.profileID;
            listing.title = req.body.title;
            listing.tags = req.body.tags;
            listing.price = req.body.price;
            listing.fromDate = req.body.fromDate;
            listing.toDate = req.body.toDate
            listing.fromTime = req.body.fromTime;
            listing.toTime = req.body.toTime;
            listing.description = req.body.description;
            listing.additionalDetail = req.body.additionalDetail;
            listing.imageArray = JSON.parse(req.body.imageArray);

            listing.save().then((insertData) => {
                return res.status(201).send(apiResponse.sendReply(1, 'Listing Data Saved', insertData));
            })
        } catch (e) {
            console.log(e);
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'Create Listing Error Occured'));
        }
    })


    app.delete('/selling-listing/', listingValidations.deleteListing(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }
            profileID = req.body.profileID
            listingID = req.body.listingID
            await sellingListingModel.deleteOne({
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


    app.put('/selling-listing/', listingValidations.updateListing(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }
            listingID = req.body.listingID
            let result = await sellingListingModel.findOne({
                $and: [{
                    listingID
                }]
            })
            console.log(result);


            if (result) {
                result.price = req.body.price || result.price;
                result.profile_id = req.body.profile_id || result.profile_id;
                result.title = req.body.title || result.title;
                result.tags = req.body.tags || result.tags;
                result.price = req.body.price || result.price;
                result.fromDate = req.body.fromDate || result.fromDate;
                result.fromTime = req.body.fromTime || result.fromTime;
                result.toTime = req.body.toTime || result.toTime;
                result.description = req.body.description || result.description;
                result.additionalDetail = req.body.additionalDetail || result.additionalDetail;
                result.imageArray = req.body.imageArray || result.imageArray;

                await result.save()

                return res.status(201).json(apiResponse.sendReply(1, 'Listing Data Updated'));

            } else {
                return res.status(500).json(apiResponse.sendReply(0, 'Listing cannot be updated'));
            }
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listing Update Error Occured'));
        }

    });

    app.get('/selling-listing/', listingValidations.getListing(), async (req, res) => {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }

            listingID = req.body.listingID
            sellingListingModel.findOne({
                $and: [{
                    listingID
                }]
            }).then(result => {
                return res.status(201).json(apiResponse.sendReply(1, 'Got Listing Data', result));
            })

        } catch (e) {
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listing Get by ID Error Occured'));
        }

    });

    app.get('/selling-listings/', listingValidations.getListings(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }
            profileID = req.body.profileID
            sellingListingModel.find({
                profileID
            }).then(result => {
                return res.status(201).json(apiResponse.sendReply(1, 'got Listings Data', result));
            })
        } catch (e) {
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listings Get Error Occured'));
        }
    });


    app.get('/listingfilter', async (req, res) => {
        try {
            priceGreater = req.body.priceGreater
            priceLower = req.body.priceLower
            toDate = req.body.toDate
            fromDate = req.body.fromDate
            toTime = req.body.toTime
            fromTime = req.body.fromTime
            tags = req.body.tags

            // Filter by date time price tag
            const condObj = {
                ...(priceGreater && priceLower ? {
                    price: {
                        $gt: parseInt(priceGreater),
                        $lt: parseInt(priceLower)
                    }
                } : {}),
                ...(toDate && fromDate ? {
                    toDate: {
                        $lt: toDate
                    },
                    fromDate: {
                        $gt: fromDate
                    }
                } : {}),
                ...(tags ? {
                    tags: {
                        '$in': tags.split(",")
                    }
                } : {}),
            };

            console.log(condObj)
            let filterRes = await sellingListingModel.find(condObj)
            return res.status(201).send(apiResponse.sendReply(1, 'Listing filter data received', filterRes));
        } catch (e) {
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listing Filter Error Occured'))
        }
    });

}