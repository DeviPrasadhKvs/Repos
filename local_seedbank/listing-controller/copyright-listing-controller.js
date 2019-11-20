const copyrightListingValidations = require('../validators/copyright-listing-validator')


module.exports = function product(app, copyrightListingModel, apiResponse, validationResult) {


    app.post('/copyright-listing', copyrightListingValidations.addCopyrightListing(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }
            let copyrightImageArray = '';
            if (req.body.imageArray) {
                copyrightImageArray = req.body.copyrightImageArray.split(",");
            }
            let copyrightListing = new copyrightListingModel();
            copyrightListing.profileID = req.body.profileID;
            copyrightListing.copyrightTitle = req.body.copyrightTitle;
            copyrightListing.copyrightDescription = req.body.copyrightDescription;
            copyrightListing.copyrightImage = copyrightImageArray;

            copyrightListing.save().then((insertData) => {
                return res.status(201).send(apiResponse.sendReply(1, 'Listing Data Saved', insertData));
            })
        } catch (e) {
            console.log(e);
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'Create Listing Error Occured'));
        }
    })


    app.delete('/copyright-listing/:id', copyrightListingValidations.deleteCopyrightListing(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }
            let listingID = req.params.id
            await copyrightListingModel.deleteOne({
                listingID
            });
            return res.status(200).json(apiResponse.sendReply(1, 'Listing Deleted'));
        } catch (e) {
            console.log(e);
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listing Deletion Error Occured'));
        }
    });


    app.put('/copyright-listing/:id', copyrightListingValidations.updateCopyrightListing(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }
            let listingID = req.params.id
            let result = await copyrightListingModel.findOne({
                listingID
            })
            if (result) {
                result.copyrightTitle = req.body.copyrightTitle || result.copyrightTitle;
                result.copyrightDescription = req.body.copyrightDescription || result.copyrightDescription;
                result.copyrightImage = copyrightImageArray || result.copyrightImageArray;

                await result.save()
                return res.status(201).json(apiResponse.sendReply(1, 'Listing Data Updated'));7
            } else {
                return res.status(500).json(apiResponse.sendReply(0, 'Listing cannot be updated'));
            }
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listing Update Error Occured'));
        }
    });


    app.get('/copyright-listing/:id', copyrightListingValidations.getCopyrightListing(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }

            let copyrightListingId = req.body.id
            copyrightListingModel.findOne({
                copyrightListingId
            }).then(result => {
                return res.status(201).json(apiResponse.sendReply(1, 'Got Listing Data', result));
            })
        } catch (e) {
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listing Get by ID Error Occured'));
        }
    });

    
    app.get('/copyright-listing/', copyrightListingValidations.getCopyrightListings(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));
            }
            let profileID = req.query.profileID
            copyrightListingModel.find({
                profileID
            }).then(result => {
                return res.status(201).json(apiResponse.sendReply(1, 'got Listings Data', result));
            })
        } catch (e) {
            apiResponse.reportError(e)
            return res.status(500).json(apiResponse.sendReply(0, 'Listings Get Error Occured'));
        }
    });
 
}