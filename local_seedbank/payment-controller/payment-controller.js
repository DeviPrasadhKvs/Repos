const stripe = require("stripe")("sk_test_N77Y1NnYyGeXc5izKzPgmrnT009hXTKwd4");
const service = require('./paymentControllerService')
const bodyParser = require('body-parser');

module.exports = (app, paymentSchema, customeSchema, fundVerfication, cpyRight) => {

    app.get('/checkCustomerExists', (req, res) => {
        var s = new service(customeSchema, res)
        s.checkCustomerExists({ profileID: req.query.id })
    })

    app.get('/chatVerify/:id1/:id2', (req, res) => {
        var s = new service(fundVerfication, res)
        s._initiateChatPayVerification({ member1: req.params.id1, member2: req.params.id2 })
    })

    app.post('/cpyPay', (req, res) => {
        console.log(req.body);

        var s = new service(paymentSchema, res)
        s._CpyPayment(req.body.id, req.body.profileID, req.body.description)
    })
    app.get('/cpyVerify/:id', (req, res) => {
        var s = new service(paymentSchema, res)
        s._CpyVerify(req.params.id)
    })
    app.post('/initiateCopyRight', (req, res) => {
        var s = new service(cpyRight, res)
        s._initiateCpyRight(req.body)
    })
    app.get('/createCustomer', (req, res) => {
        var s = new service(customeSchema, res)
        s.createCustomer({ profileID: req.query.id })
    })

    app.post('/createCard', (req, res) => {
        var s = new service(customeSchema, res)
        console.log(req.body);

        s.createCardToken(req.body)
    })

    app.post('/linkCardToken', (req, res) => {
        var s = new service(customeSchema, res)
        s.linkCard({ profileID: req.body.id, cardToken: req.body.cardToken })
    })
    app.get('/ocInit/:profileID/:listingID', (req, res) => {
        var s = new service(paymentSchema, res)
        s.ocInit({ profileID: req.params.profileID, listingID: req.params.listingID })
    })
    app.get('/verifyOCPay/:id', (req, res) => {
        var s = new service(paymentSchema, res)
        s.verifyPayment(req.params.id)
    })
    app.get('/pcInit/:profileID/:listingID', (req, res) => {
        var s = new service(paymentSchema, res)
        s.pcInit({ profileID: req.params.profileID, listingID: req.params.listingID })
    })
    app.get('/pcUpdate/:listingID/:gntee', (req, res) => {
        var s = new service(paymentSchema, res)
        s.pcUpdate({ collaborationID: req.params.listingID, gntee: req.params.gntee })
    })
    app.get('/verifyPCPay/:id', (req, res) => {
        var s = new service(paymentSchema, res)
        s.verifyPCPayment(req.params.id)
    })


    app.get('/linkPaymentMethodToCustomer', (req, res) => {
            var s = new service(customeSchema, res)
            s._linkPaymentMethodTocustomer(paymentSchema, req.query.id)
        })
        // app.post('/createCardAndLinkToCustomer', (req, res) => {
        //     var s = new service(customeSchema, res)
        //     s.createCustomer({ profileID: req.query.id })
        //     var s = new service(customeSchema, res)
        //     s.linkCard({ profileID: req.body.id, cardToken: req.body.cardToken })
        // })

    // app.get('/c', (req, res) => {
    //     var s = new service(customeSchema, res)
    //     s.createCustomer({ profileID: '123456' })
    // })

    app.get('/initiatePayment/:id', (req, res) => {
        var s = new service(paymentSchema, res)
        s._inititatePayment({ collaborationID: req.params.id }, customeSchema)
    })


    app.post('/linkPayToken', (req, res) => {
        var s = new service(paymentSchema, res)
        s.createPaymentMethodforTranscation(req.body.cardToken, req.body.id)
    })
    app.get('/makePayment', (req, res) => {
        var s = new service(paymentSchema, res)
        s.makePayment(req.query.id)
    })

    app.post('/paymentHook', bodyParser.raw({ type: 'application/json' }), (request, response) => {
        console.log('***********************in payment hook ');

        let event;

        try {
            event = JSON.parse(request.body);
        } catch (err) {
            console.log(err);

            response.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log("e");

                console.log(paymentIntent);

                var s = new service(paymentSchema, response)
                s.confirmPayment(paymentIntent)
                break;
                // case 'payment_method.attached':
                //     const paymentMethod = event.data.object;
                //     console.log(paymentMethod)
                //     break;
                // default:
                return response.status(400).end();
        }

        // Return a response to acknowledge receipt of the event
        // response.json({ received: true });
    });

    app.post('/charges', (req, res) => {
        console.log(req.body);
        var profileId = req.body.profileId
        var amount = req.body.amount
        var currencyCode = req.body.currency
        var sourceId = req.body.source

        var payment = new paymentSchema();
        // create a customer 
        stripe.customers.create({
            profileId: req.body.profileId, // customer email, which user need to enter while making payment
            sourceId: req.body.sourceId // token for the given card 
        }).then(customers =>
            stripe.charges.create({
                    amount: req.body.amount,
                    currency: req.body.currency,
                    receipt_email: req.body.receipt_email,
                    source: sourceId,
                },

                function(err, charge) {
                    if (err) {
                        payment.profileId = profileId
                        payment.transcationId = ''
                        payment.amount = amount
                        payment.status = 'success'
                        payment.payeeId = ''
                        payment.payee_profileId = ''
                        payment.payerId = ''
                        payment.mode = ''
                        payment.type = ''
                        payment.currency = currencyCode
                        payment.customerID = ''
                        payment.paymentTranscationId = ''
                        payment.description = err.code + '' + err.message
                        payment.time = new Date().getTime()
                        payment.payment_receipt_url = ''
                        payment.country = ''
                        payment.sourceId = sourceId
                    } else {
                        payment.profileId = profileId
                        payment.transcationId = ''
                        payment.amount = charge.amount
                        payment.status = charge.status
                        payment.payeeId = ''
                        payment.payee_profileId = ''
                        payment.payerId = ''
                        payment.mode = charge.type
                        payment.type = charge.payment_method_details.card.brand
                        payment.currency = charge.currency
                        payment.customerID = ''
                        payment.paymentTranscationId = charge.id
                        payment.description = charge.description
                        payment.time = new Date().getTime()
                        payment.payment_receipt_url = charge.receipt_url
                        payment.country = ''
                        payment.lastFour = charge.last4
                        payment.sourceId = sourceId
                    }
                    payment.save().then((data) => {
                        res.send({
                            data: err ? err : charge,
                            status: 'success'
                        })
                    }).catch((err) => {
                        console.log(err);
                        res.send({ error: err })
                    })
                }))
    })

    app.post('/createCard', (req, res) => {
        var profileID = req.body.profileID
        var sourceID = req.body.sourceID
        console.log(profileID);
        console.log(req.body);

        customeSchema.find({ profile_id: profileID }).then((data) => {
            if (data.length < 1) {
                var customer_Schema = new customeSchema()
                customer_Schema.profile_id = profileID
                stripe.customers.create({
                    name: profileID,
                    source: sourceID
                }, function(err, customer) {
                    console.log(!err);
                    console.log(customer);
                    if (!err) {
                        customer_Schema.customer_id = customer.id
                        customer_Schema.save(function(err, d) {
                            if (!err) {
                                console.log('here');
                                res.send({ status: 'csavd', data: customer, customer: d })
                            } else {
                                console.log('hereErr');
                                res.send({ status: 'err', data: err })
                            }
                        })
                    } else {
                        res.send({ status: 'fail', data: err })
                    }
                });
            } else {
                stripe.customers.createSource(
                    data[0].customer_id, {
                        source: sourceID,
                    },
                    function(err, card) {
                        if (!err) {
                            res.send({ status: 'updated', customer: data[0], data: card })
                        } else {
                            res.send({ status: 'error', data: err })
                        }
                    }
                );
            }
        }).catch(error => {
            res.send({ status: 'error', error: error })
        })
    })

    app.post('/checkCustomerandAddCard', (req, res) => {
        var s = new service(customeSchema, res)
        s.checkAndAddCard({ profileID: req.body.id, cardToken: req.body.cardToken })
    })

    app.get('/listCards/:id', (req, res) => {
        var s = new service(customeSchema, res)
        s.listCustomerCards({ profileID: req.params.id })
    })

    app.get('/testtt', (req, res) => {
        var s = new service()
        s._initInvoice({
            profileID: 'vsdvdvsv',
            transcationID: 'vsdvdvsv',
            description: 'vsdvdvsv',
            title: 'vsdvdvsv'
        }, (status, data) => {
            if (status === 1) {
                s._addInvoiceCategory(data.invoiceID, { category: 'sample' }, (status) => {
                    res.send(status)
                })
            } else {
                res.send('error')
            }
        })
    })



    app.post('/initInvoice', (req, res) => {
        console.log(req.body);
        var s = new service()
        s._initInvoice({
            profileID: req.body.profileID,
            invoiceType: 'COLLABORATION',
            invoiceTypeID: req.body.collaborationID,
            title: req.body.title,
            description: req.body.description,
            thumblain: req.body.thumblain,
            payeeID: req.body.payeeID,
            location: req.body.location,
            sessions: req.body.sessions,
            isExtended: req.body.isExtended,
            total: req.body.total,
            extendedSessions: req.body.extendedSessions
        }, (data) => {
            res.send(data)
        })
    })

    app.get('/fetchInvoice/:collaborationID', (req, res) => {
        var s = new service()
        s._fetchInvoice(req.params.collaborationID, (data) => {
            res.send(data)
        })
    })

    app.post('/addItemsInv', (req, res) => {
        var s = new service()
        s._addInvoiceSessions(req.body.id, req.body.data, (data) => {
            res.send(data)
        })
    })
}