const disputeValidations = require('../validators/disputeValidators')

var uniqid = require('uniqid');
module.exports = (app, disputeModel, profileDataModel, apiResponse, validationResult) => {

    app.post('/raiseDispute', disputeValidations.raiseDispute(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            let disputeDataModel = new disputeModel()
            disputeDataModel.disputeID = uniqid('DISPUTE')
            disputeDataModel.collaborationID = req.body.collaborationID
            disputeDataModel.disputeRaisedBy = req.body.disputeRaisedBy
            disputeDataModel.disputeAgainst = req.body.disputeAgainst
            disputeDataModel.disputeTitle = req.body.disputeTitle
            disputeDataModel.disputeDesciption = req.body.disputeDesciption

            disputeDataModel.save().then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'Dipsute raised Successfully', data))
            })
        } catch (e) {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while raising dispute'))
        }
    })

    app.get('/getAllDisputes', (req, res) => {
        disputeModel.find({}).then(data => {
            return res.status(200).send(apiResponse.sendReply(1, 'fetched disputes successfully', data))
        }).catch(e => {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(1, 'some error while fetching disputes'))
        })
    })

    app.get('/getDisputesByID/:profileID', disputeValidations.getProfileDisputes(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            disputeModel.find({ $or: [{ disputeRaisedBy: req.params.profileID }, { disputeAgainst: req.params.profileID }] }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'fetched disputes successfully', data))
            })
        } catch (e) {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while fetching disputes'))
        }
    })

    app.get('/getDisputeDetails/:disputeID', disputeValidations.getDisputeDetails(), (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(412).json(apiResponse.sendReply(0, 'validation error'));
            }
            disputeModel.findOne({ disputeID: req.params.disputeID }).then(data => {
                return res.status(200).send(apiResponse.sendReply(1, 'fetched dispute details successfully', data))
            })
        } catch (e) {
            console.log(e)
            return res.status(500).send(apiResponse.sendReply(0, 'validation error while fetching dispute details'))
        }
    })

}