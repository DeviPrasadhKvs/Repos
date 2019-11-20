const connectionValidations = require('../validators/connectionController-validator')

module.exports = (app, profileDataModel, apiResponse, preferencesModel, validationResult) => {

    app.get('/addconnection/:owner/:sender', connectionValidations.connectionRequest(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            var sender = req.params.sender
            var owner = req.params.owner
            preferencesModel.findOneAndUpdate({ profileID: owner }, { $addToSet: { connections: sender } }, (err, data) => {
                if (data) {
                    return res.status(200).send(apiResponse.sendReply(1, 'connection made'))
                } else {
                    return res.status(500).send(apiResponse.sendReply(0, 'connection not made'))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while adding connection'))
        }
    })

    app.get('/removeconnection/:owner/:sender', connectionValidations.connectionRequest(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            var sender = req.params.sender
            var owner = req.params.owner
            preferencesModel.findOneAndUpdate({ profileID: owner }, { $pull: { connections: sender } }, (err, data) => {
                if (data) {
                    return res.status(200).send(apiResponse.sendReply(1, 'connection removed'))
                } else {
                    return res.status(500).send(apiResponse.sendReply(0, 'connection not removed'))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while removing connection'))
        }
    })


    app.get('/isFollowing/:profileID/:mProfileID', connectionValidations.getProfileConnection(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            let mProfileID = req.params.mProfileID
            let profileID = req.params.profileID

            preferencesModel.findOne({ profileID }, ('connections'), (err, data) => {
                if (data) {
                    console.log(data.connections);
                    if (data.connections.includes(mProfileID)) {
                        return res.status(200).send(apiResponse.sendReply(1, 'following'))
                    } else {
                        return res.status(200).send(apiResponse.sendReply(0, 'not following'))
                    }
                } else {
                    return res.status(500).send(apiResponse.sendReply(0, 'connection not made'))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'connection not made due to validation error'))
        }
    })

    app.get('/blockuser/:profileID/:mProfileID', connectionValidations.getProfileConnection(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            let mProfileID = req.params.mProfileID
            let profileID = req.params.profileID

            preferencesModel.findOneAndUpdate({ profileID }, { $addToSet: { blocked: mProfileID } }, (err, data) => {
                console.log('changed        +++++++++++++++++')
                if (data) {
                    preferencesModel.findOneAndUpdate({ profileID: mProfileID }, { $push: { blockedBy: profileID } }, (error, data1) => {
                        console.log('changed-------------------------------------')
                        if (data1) {
                            return res.status(200).send(apiResponse.sendReply(1, 'blocked'))
                        } else {
                            return res.status(500).send(apiResponse.sendReply(0, 'error while blocking'))
                        }
                    })
                } else {
                    return res.status(500).send(apiResponse.sendReply(0, 'error while blocking'))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while blocking the connection'))
        }
    })

    app.get('/unblockuser/:profileID/:mProfileID', connectionValidations.getProfileConnection(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            let mProfileID = req.params.mProfileID
            let profileID = req.params.profileID
            preferencesModel.findOneAndUpdate({ profileID }, { $pull: { blocked: mProfileID } }, (err, data) => {
                if (data) {
                    preferencesModel.findOneAndUpdate({ profileID: mProfileID }, { $pull: { blockedBy: profileID } }, (error, data1) => {
                        if (data1) {
                            return res.status(200).send(apiResponse.sendReply(1, 'unblocked'))
                        } else {
                            return res.status(500).send(apiResponse.sendReply(0, 'error while unblocking'))
                        }
                    })
                } else {
                    return res.status(500).send(apiResponse.sendReply(0, 'error while blocking'))
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while blocking the connection'))
        }
    })


    app.post('/sendconreq', connectionValidations.getUserAccess(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            var sender = req.body.sender
            var owner = req.body.owner
            preferencesModel.findOneAndUpdate({ profileID: owner }, { $addToSet: { waitingConnections: sender } }, (err, data) => {
                if (data) {
                    res.status(200).json({
                        code: 'success',
                    })
                } else {
                    res.status(500).json({
                        code: 'error',
                        msg: 'Failed'
                    })
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while sending connection request'))
        }
    })

    app.post('/rejectconreq', connectionValidations.getUserAccess(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            var sender = req.body.sender
            var owner = req.body.owner
            preferencesModel.findOneAndUpdate({ profileID: owner }, { $pull: { waitingConnections: sender } }, (err, data) => {
                if (data) {
                    res.status(200).json({
                        code: 'success',
                    })
                } else {
                    res.status(500).json({
                        code: 'error',
                        msg: 'Failed'
                    })
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while rejecting connection request'))
        }
    })

    app.post('/blockconnection/:profileID/:target', connectionValidations.blockConnection(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            var target = req.params.target
            var profileID = req.params.profileID
            preferencesModel.findOneAndUpdate({ profileID: profileID }, { $addToSet: { blocked: target }, $pull: { connections: target } }, (err, data) => {
                if (data) {
                    preferencesModel.findOneAndUpdate({ profileID: target }, { $push: { blockedBy: profileID }, $pull: { connections: profileID } }, (error, data1) => {
                        if (data1) {
                            res.status(200).json({
                                code: 'success',
                                msg: 'conenction added'
                            })
                        } else {
                            res.status(500).json({
                                code: 'error',
                                msg: 'Failed'
                            })
                        }
                    })
                } else {
                    res.status(500).json({
                        code: 'error',
                        msg: 'Failed'
                    })
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while blocking profile target'))
        }

    })

    app.get('/getblocked/:profileID', connectionValidations.blockProfileConnection(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            var profileID = req.params.profileID
            preferencesModel.aggregate([{
                    '$match': {
                        'profileID': profileID
                    }
                },
                {
                    '$lookup': {
                        'from': 'profiles',
                        'localField': 'blocked',
                        'foreignField': 'profileID',
                        'as': 'blockedData'
                    }
                },
                {
                    '$lookup': {
                        'from': 'imageschemas',
                        'localField': 'profileImage',
                        'foreignField': 'imageID',
                        'as': 'profileImageData'
                    }
                },
                {
                    '$project': {
                        'blockedData.displayName': true,
                        'blockedData.username': true,
                        'blocked': true,
                        'profileImage': true,
                        'profileImageData.imageUrl': true
                    }
                },
                {
                    '$unwind': {
                        'path': '$blocked'
                    }
                },
                {
                    '$unwind': {
                        'path': '$blockedData'
                    }
                },
                {
                    '$unwind': {
                        'path': '$profileImageData'
                    }
                }
            ]).then(data => {
                console.log(data)
                return res.status(200).send(apiResponse.sendReply(1, 'Block list fetched', data))
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error in fetching blocked profiles'))
        }


    })

    app.get('/getconnections', connectionValidations.getOwnerConnections(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            var owner = req.body.owner
            preferencesModel.findOne({ profileID: owner }, 'connections', (err, data) => {
                if (data) {
                    res.status(200).json({
                        code: 'success',
                        data: data.connections
                    })
                } else {
                    res.status(500).json({
                        code: 'error',
                        msg: 'Failed'
                    })
                }
            })
        } catch (e) {
            console.log(e)
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error while fetching data'))
        }
    })
}