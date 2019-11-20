const bookmarkValidations = require('../validators/bookmarkValidators')
const uniquid = require('uniqid')

module.exports = (app, bookmarkModel, apiResponse, validationResult) => {

    //----------------------------NEW CODE-----------------------------
    app.post('/addbookmark', bookmarkValidations.insertBookmark(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            bookmarkData = new bookmarkModel()
            bookmarkData.bookMarkID = uniquid("BMK")
            bookmarkData.profileID = req.body.profileID
            bookmarkData.bookmarkType = req.body.bookmarkType
            bookmarkData.bookmarkTypeID = req.body.bookmarkTypeID
            bookmarkData.save().then(data => {
                console.log(data)
                return res.status(200).send(apiResponse.sendReply(1, 'Bookmark Added', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in adding bookmark'))
        }
    })

    app.get('/getbookmark/:bookmarkID', bookmarkValidations.getBookmarks(), (req, res) => {
        bookmarkID = req.params.bookMarkID
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error while fetching data'))
            }
            bookmarkModel.aggregate([{
                    '$match': {
                        'bookMarkID': bookmarkID
                    }
                },
                {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'bookmarkTypeID',
                        'foreignField': 'imageID',
                        'as': 'imageBookmarks'
                    }
                },
                {
                    '$lookup': {
                        'from': 'profiles',
                        'localField': 'bookmarkTypeID',
                        'foreignField': 'profileID',
                        'as': 'profileBookmarks'
                    }
                },

                {
                    '$lookup': {
                        'from': 'listings',
                        'localField': 'bookmarkTypeID',
                        'foreignField': 'listingID',
                        'as': 'listingBookmarks'
                    }
                },

            ]).then(data => {
                console.log(data)
                return res.status(200).send(apiResponse.sendReply(1, 'bookmarks fetched', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in getting bookmark'))
        }
    })


    app.get('/getMyBookmarks/:profileID', bookmarkValidations.getMyBookmarks(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error while fetching data'));
            }
            profileID = req.params.profileID
            bookmarkModel.aggregate([{
                    '$match': {
                        'profileID': profileID
                    }
                },
                {
                    '$lookup': {
                        'from': 'listings',
                        'localField': 'bookmarkTypeID',
                        'foreignField': 'listingID',
                        'as': 'listingBookmarks'
                    }
                },
                {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'bookmarkTypeID',
                        'foreignField': 'imageID',
                        'as': 'imageBookmarks'
                    }
                },
                {
                    '$lookup': {
                        'from': 'profiles',
                        'localField': 'bookmarkTypeID',
                        'foreignField': 'profileID',
                        'as': 'profileBookmarks'
                    }
                }
            ]).then(data => {
                console.log(data)
                return res.status(200).send(apiResponse.sendReply(1, 'bookmarks fetched', data))
            })
        } catch (e) {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in getting bookmarks'))
        }
    })

    app.get('/getBookmarkedImages/:profileID', bookmarkValidations.getMyBookmarks(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error while fetching data'));
            }
            bookmarkModel.find({ $and: [{ profileID: req.params.profileID }, { bookmarkType: "IMAGE" }] }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'bookmarks fetched', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in getting bookmarks'))
        }
    })

    app.get('/unbookmark/:bookmarkID', bookmarkValidations.deleteBookmark(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error while deleting bookmark'));
            }
            bookmarkModel.deleteOne({ bookMarkID: req.params.bookmarkID }).then((data) => {
                console.log('unbookmarked..!!!')
                return res.status(200).send(apiResponse.sendReply(1, 'unbookmarked ', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in unbookmarking', e))
        }
    })

















    //---------------------OLD CODE--------------------------------- 
    // app.post('/profile/bookmark/:profileID', (req, res)=>{
    //     try {

    //         console.log(req.body);
    //         profileID = req.body.profileID
    //         type = req.body.type
    //         if(type == 'profile'){
    //             bookmarkID = req.body.bookmarkID
    //             bookmarkModel.updateOne({profileID : profileID}, {$addToSet: { profileBookmarks : bookmarkID } }, {safe: true, upsert : true}, (err, updateResult)=>{
    //                 if(err){
    //                     console.log(err);
    //                     return res.status(500).send(apiResponse.sendReply(0, 'profile Bookmark failed to update'))
    //                 }else{
    //                     console.log(updateResult);
    //                     return res.status(200).send(apiResponse.sendReply(1, 'profile Bookmark created'))

    //                 }
    //             })
    //         }else if(type == 'listing'){
    //             bookmarkID = req.body.bookmarkID
    //             bookmarkModel.updateOne({profileID}, {$addToSet: { listingBookmarks: bookmarkID } }, {safe: true, upsert : true}, (err, updateResult)=>{
    //                 if(err){
    //                     console.log(err);
    //                     return res.status(500).send(apiResponse.sendReply(0, 'listing Bookmark failed to update'))
    //                 }else{
    //                     console.log(updateResult);
    //                     return res.status(200).send(apiResponse.sendReply(1, 'listing Bookmark created'))
    //                 }
    //             })
    //     }else{
    //         res.status(405).send(apiResponse.sendReply(0, 'type not allowed'))
    //     }
    //     } catch (error) {
    //         console.log(error);
    //         apiResponse.reportError(error)
    //         return res.status(500).send(apiResponse.sendReply(0, 'Bookmark exception occured'))


    //     }
    // })

    // app.delete('/profile/bookmark', bookmarkValidations.deleteBookmark(), (req, res)=>{
    //     try {
    //         const errors = validationResult(req);
    //         if (!errors.isEmpty()) {
    //             return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));    
    //         }
    //         profileID = req.body.profileID
    //         bookmarkID = req.body.bookmarkID
    //         bookmarkModel.updateOne({profileID}, {$pull : {profileBookmarks: bookmarkID, listingBookmarks: bookmarkID}}, (err, updateResponse)=>{
    //             if(err){
    //                 return res.status(500).send(apiResponse.sendReply(0, "Bookmark deletion failed"))
    //             }else{
    //                 return res.status(200).send(apiResponse.sendReply(1, "Bookmark deleted"))
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error);
    //         return apiResponse.reportError(error)
    //     }
    // })

    // app.get('/profile/bookmarks', bookmarkValidations.getBookmarks(), (req, res)=>{
    //     try {
    //         const errors = validationResult(req);
    //         if (!errors.isEmpty()) {
    //             return res.status(412).json(apiResponse.sendReply(0, 'query failed validation'));    
    //         }
    //         profileID = req.body.profileID
    //         bookmarkModel.findOne({profileID}, (err, findResponse)=>{
    //             if(err){
    //                 return res.status(500).send(apiResponse.sendReply(0, "error in getting bookmarks"))
    //             }else{
    //                 console.log(findResponse);

    //                 return res.status(200).send(apiResponse.sendReply(1, "Got Bookmarks", findResponse))
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error);
    //         return apiResponse.reportError(error)
    //     }
    // })
}