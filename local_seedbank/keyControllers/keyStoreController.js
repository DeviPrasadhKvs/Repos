const keyStoreValidator = require('../validators/keyValidator')

module.exports = (app, apiResponse, keyStoreModel, statusModel, validationResult) => {

    app.post('/storekeys', keyStoreValidator.storeKeys(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            console.log('*****************');
            data = req.body
            console.log(data);
            keysData = new keyStoreModel()
            keysData.profileID = data.profileID
            keysData.privateKey = data.privateKey
            keysData.publicKey = data.publicKey
            keysData.save().then(mydata => {
                console.log(mydata);
                statusModel.findOneAndUpdate({ profileID: req.body.profileID }, { encryptionKeySet: true }, { upsert: true, new: true }).then(d => {
                    console.log('key status changed')
                }).catch(e => {
                    console.log('error in changing key status', e)
                })
                return res.status(200).send(apiResponse.sendReply(1, 'keys Stored', { mydata }))
            }).catch(e => {
                console.log(e);
                return res.status(500).send(apiResponse.sendReply(0, 'error', e))
            })
        } catch (e) {
            console.log(e);
            apiResponse.reportError(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while storing keys', e))
        }
    })

    app.get('/getkeys', (req, res) => {
        try {

            console.log(req.headers)
            keyStoreModel.findOne({ profileID: req.headers.profileID }, (err, data) => {
                if (err) {
                    return res.status(500).send(apiResponse.sendReply(0, 'error'))
                } else {
                    console.log(data);
                    return res.status(200).send(apiResponse.sendReply(1, 'keys got', data))
                }
            })
        } catch (e) {
            apiResponse.reportError(e)
            console.log(data);
            return res.status(500).send(apiResponse.sendReply(0, 'error', e))

        }
    })

    app.get('/getPublicKey/:profileID', keyStoreValidator.getProfileKeys(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            keyStoreModel.findOne({ profileID: req.params.profileID }, { publicKey: true }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'keys got', data))
            })
        } catch (e) {
            apiResponse.reportError(e)
            console.log(data);
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while fetching keys', e))
        }
    })

    app.get('/getKeyStatus', async(req, res) => {
        console.log('******************');
        console.log(req.headers);
        try {
            statusModel.findOne({ profileID: req.headers.profileid }, { encryptionKeySet: 1 }).then(data => {
                console.log(data)
                if (data != null) {
                    return res.status(200).send(apiResponse.sendReply(1, 'key status', data))
                } else {
                    return res.status(200).send(apiResponse.sendReply(1, 'key status', { encryptionKeySet: false }))
                }
            }).catch(e => {
                console.log(e)
                return res.status(500).send(apiResponse.sendReply(0, 'error while getting key status', e))
            })
        } catch (e) {
            apiResponse.reportError(e)
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'error while getting key status', e))
        }
    })
}