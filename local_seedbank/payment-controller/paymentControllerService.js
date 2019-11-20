"use strict";
const invoiceModel = require("./../models/invoiceModel")
const stripe = require("stripe")("sk_test_N77Y1NnYyGeXc5izKzPgmrnT009hXTKwd4");
const http = require('https')
const axios = require('axios')
let customers = require('./../models/customers-schema');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// let invoice = require('./../models/invoiceModel');

var randomstring = require("randomstring");
class Payments {

    constructor(model, response) {
        this.model = model
        this.response = response
    }


    _createCustomer(data, callBack) {
        var profileID = data
        var a = new customers()
        a.profileID = profileID
        console.log('*******');
        console.log(profileID);

        a.save().then((data) => {
            console.log(data);

            stripe.customers.create({
                name: profileID,
            }).then((customerData) => {
                console.log(data);
                this.customerID = customerData.id
                customers.findOneAndUpdate({ profileID: profileID }, { $set: { customerID: this.customerID, createOn: new Date().getTime(), lastUpdatedOn: new Date().getTime() } }).then((data) => {
                    console.log(data);

                    callBack(1)
                }).catch((err) => {
                    console.log('***err');

                    console.log(err);

                    callBack(-2)
                }).catch((err) => {
                    console.log('***err');

                    console.log(err);

                    callBack(-1)
                })
            }).catch((err) => {
                console.log('***err');

                console.log(err);

                callBack(0)
            })
        })
    }

    createCustomer(data) {
        var profileID = data.profileID
        var a = new this.model()
        a.profileID = data.profileID
        a.save().then((data) => {
            stripe.customers.create({
                name: profileID,
            }).then((data) => {
                this.model.updateOne({ profileID: profileID }, { $set: { customerID: data.id, createOn: new Date().getTime(), lastUpdatedOn: new Date().getTime() } }).then((data) => {
                    this.response.send({
                        status: 1,
                        message: 'created customer'
                    })
                }).catch((data) => {
                    this.response.send({
                        status: 1,
                        message: 'cant update customer'
                    })
                })
            }).catch((data) => {
                this.response.send({
                    status: 1,
                    message: 'cant update customer'
                })
            })
        }).catch((data) => {
            return 0;
        })
    }

    checkCustomerExists(data) {
        this.model.findOne({ profileID: data.profileID }).then((data) => {
            if (data != null) {
                this.response.send({
                    status: 1,
                    message: 'user exists',
                    customerID: data.customerID
                })
            } else {
                this.response.send({
                    status: 1,
                    message: 'user dont exist'
                })
            }
        }).catch((data) => {
            console.log('error', data);
        })
    }

    listCustomerCards(data) {
        var profileID = data.profileID
        this._retriveCustomerID(profileID, (d) => {
            if (d === 0) {
                this.response.send({
                    status: 1,
                    message: 'user doesnt exist'
                })
            } else {
                stripe.customers.listSources(this.customerID, { object: 'card' }).then((cards) => {
                    this.response.send({
                        status: 1,
                        data: cards.data
                    })
                }).catch((data) => {
                    this.response.send({
                        status: 0,
                        message: 'some internal error with gateway'
                    })
                })
            }
        })
    }

    linkCard(data) {
        console.log(data);

        var sourceID = data.cardToken
        stripe.customers.createSource(
            this.customerID, {
                source: sourceID,
            }).then(data => {
            console.log(data);
            axios.get('https://seedbank.theotherfruit.io/setCardsStatus/' + data.profileID + '/true').then((res) => {
                console.log({ status: 1, message: 'attached' });

                this.response.send({ status: 1, message: 'attached' })

            }).catch((error) => {
                this.response.send({ status: 1, message: 'error in updating' })
                console.error(error)
            })


        }).catch(data => {
            console.log(data);
            this.response.send({ status: 0, message: 'cant attach', data: data })
            console.log({ status: 0, message: 'cant attach', data: data });

        })
    }

    createPaymentMethodforTranscation(cardToken, id) {
        console.log(id);
        console.log(cardToken);

        stripe.paymentMethods.create({
            type: "card",
            card: {
                token: cardToken
            }
        }).then(data => {
            console.log(id);
            console.log(data);
            var d = { "paymentMethodID": data.id }
            this.model.updateOne({ "_id": id }, {
                $set: d
            }).then(dd => {
                console.log(dd);
                this.response.send({
                    status: 1,
                    message: 'payment method created for single time use use id',
                })
            }).catch(data => {
                this.response.send({
                    status: 0,
                    message: 'unable to update payment method'
                })
            })
        }).catch(data => {
            console.log(data);

            this.response.send({
                status: 0,
                message: 'fail to identify payment please start over'
            })
        })
    }

    _CpyPayment(cpyID, profileID, description) {
        this._retriveCustomerID(profileID, (dd) => {
            console.log(dd);
            if (dd === 1) {
                var model = this.model
                this.model = new this.model()
                var id = randomstring.generate({ length: 4, charset: 'alphabetic' }) + profileID.substr(0, 4) + cpyID.substr(0, 4) + new Date().getTime().toString().substr(0, 4)
                this.model._id = id
                this.model.collaborationID = cpyID
                this.model.profileID = profileID
                this.model.payerId = profileID
                this.model.save().then((data) => {
                    this.model = model
                    stripe.paymentIntents.create({
                        amount: 99,
                        currency: 'usd',
                        customer: this.customerID,
                        payment_method_types: ['card'],
                    }).then((paymentIntent) => {
                        var ddata = {}
                        ddata.amount = 99
                        ddata.fee = 0
                        ddata.status = 'INITIATED'
                        ddata.paymentIntentID = paymentIntent.id
                        ddata.initiateTime = new Date().getTime()
                        ddata.description = description
                        this.model.findOneAndUpdate({ _id: id }, ddata, { new: true }).then((d) => {
                            this.response.send({
                                status: 1,
                                message: 'payment initiated',
                                id: id,
                                data: {
                                    title: d.description,
                                    item: 'Copyright Registration',
                                    amount: 99,
                                    secrect: paymentIntent.client_secret
                                },
                            })
                        })
                    }).catch((err) => {
                        console.log(err);

                        this.response.send({ status: 0, message: 'Technical error please try later' })
                    })
                })
            } else {
                this.response.send({ status: 0, message: 'customer not found' })
            }
        })
    }

    _CpyVerify(id) {
        console.log(id);

        this.model.findOne({ _id: id }).then((data) => {
            console.log(data);

            if (data != null) {
                stripe.paymentIntents.retrieve(
                    data.paymentIntentID
                ).then((intentData) => {
                    if (intentData.status === 'succeeded') {
                        axios.post('https://h2o.theotherfruit.io/paymentsuccess/' + data.collaborationID).then((res) => {
                            console.log(res);
                            this.response.send(res.data)
                        }).catch((error) => {
                            this.response.send({ status: 1, message: 'error in updating' })
                            console.error(error)
                        })
                    } else {
                        this.response.send({
                            status: 0,
                            message: 'cant complete try later'
                        })
                    }
                })
            } else {
                this.response.send({
                    status: 0,
                    message: 'cant complete try later'
                })
            }
        }).catch((err) => {
            this.response.send({
                status: 0,
                message: 'cant complete try later'
            })
        })

    }

    makePayment(id) {
        this.model.findOne({ _id: id }).then(data => {
            if (data != null) {
                stripe.paymentIntents.confirm(data.paymentIntentID, { payment_method: data.paymentMethodID }).then(data => {
                    this.storeTranscationDetails(data, id)
                }).catch(data => {
                    console.log(data);

                    this.storeFailDetails(id)
                })
            } else {
                this.response.send({
                    status: 0,
                    message: 'cant make payment'
                })
            }
        })
    }

    confirmPayment(d) {
        this.model.findOne({ paymentIntentID: d.id }).then(data => {
            if (data != null) {
                if (d.amount === (data.amount + data.fee) * 100) {
                    this.model.updateOne({ _id: data._id }, { $set: { status: d["status"] } }).then(d => {
                        http.get('https://h2o.theotherfruit.io/setPaymentStatus/' + data.collaborationID, (resp) => {
                            let d = '';
                            resp.on('data', (chunk) => {
                                d += chunk
                            });

                            resp.on('end', () => {
                                if (JSON.parse(d).status === 1) {
                                    this.response.send({ status: 1, message: 'success' })
                                } else {
                                    this.response.send({ status: 1, message: 'error in status updated' })
                                }
                            })
                        }).on("error", function(e) {
                            this.response.send({ status: 1, message: 'error in status updated' })
                            console.log("Got error: " + e.message);
                        });
                    }).catch(data => {
                        this.response.send({ status: 1, message: 'error in status updated' })
                    })
                } else {
                    this.model.updateOne({ _id: data._id }, { $set: { status: "REVIEWREQUIRE" } }).then(data => {
                        this.response.send({ status: 1, message: 'REVIEW REQUIRE', warningLevel: 500 })
                    }).catch(data => {
                        this.response.send({ status: 1, message: 'error in status updated' })
                    })
                }

            } else {
                this.response.send({ received: true, message: 'id not found' })
            }
        }).catch(data => {
            this.response.send({ status: 0, message: 'error in retriving data' })
        })
    }

    createCardToken(data) {
        var cardNumber = data.cardNumber
        var expMonth = data.expMonth
        var expYear = data.expYear
        var cvc = data.cvc

        stripe.tokens.create({
            card: {
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc: cvc
            }
        }).then((data) => {
            this.response.send({
                status: 1,
                message: 'card token created',
                cardToken: data.id
            })
        }).catch((data) => {
            this.response.send({
                status: 1,
                message: 'card token creation failed',
                message: data
            })
        })
    }

    _linkPaymentMethodTocustomer(paymenSchema, id) {
        paymenSchema.findOne({ _id: id }).then((data) => {
            this.model.findOne({ profileID: data.profileID }).then(d => {
                if (d != null) {
                    stripe.paymentMethods.attach(data.paymentMethodID, { customer: d.customerID }, function(err, paymentMethod) {
                        if (err) {
                            this.response.send({
                                status: 0,
                                message: 'cant attach',
                                err: err
                            })
                        } else {
                            this.response.send({
                                status: 1,
                                message: 'attached payment method'
                            })
                        }
                    });
                }
            })
        }).catch((data) => {
            this.response.send({
                status: 0,
                message: 'cant attach',
                data: data
            })
        })
    }

    _initiateChatPayVerification(data) {
        console.log('in initiateverify 0');
        this.initiatePaymentVerification({
            amount: 1000,
            currency: 'usd',
            payment_method_types: ['card'],
        }, data.member1, data.member2, 'CHATVERIFICATION', 1000)
    }
    _inititatePayment(data) {
        console.log('in initiate 0');
        this.fetchAmount(data.collaborationID, (d) => {
            this.initiatePayment({
                amount: (d.data.range * 100) + 1000,
                currency: 'usd',
                payment_method_types: ['card'],
            }, d.data.purchasingMember, d.data.purchasingMember, data.collaborationID, d.data.range)
        })

    }
    _initiateCpyRight(data) {
        this._retriveCustomerID(data.profileID, (dd) => {
            if (dd === 1) {
                this.model = new this.model()
                this.model.profileID = data.profileID
                this.model.data = data
                this.model.save().then((d) => {
                    this.response.send({
                        status: 1,
                        message: 'copyright initiated',
                        data: d
                    })
                }).catch(err => {
                    this.response.send({ status: 0, message: 'fail to store initiate try later' })
                })
            }
        })
    }


    fetchAmount(id, callBack) {
        console.log('in fetch 0');

        http.get('https://h2o.theotherfruit.io/getPrice/' + id, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                console.log(data);
                data += chunk
            });

            resp.on('end', () => {
                callBack(JSON.parse(data))
            })
        }).on("error", function(e) {
            console.log("Got error: " + e.message);
        });
    }
    initiatePaymentVerification(data, profileID, payeeProfileID, collaborationID, amount) {
        var model = this.model
        this.model = customers
        this._retriveCustomerID(profileID, (dd) => {
            if (dd === 1) {
                var id = randomstring.generate({ length: 4, charset: 'alphabetic' }) + profileID.substr(0, 4) + payeeProfileID.substr(0, 4) + new Date().getTime().toString().substr(0, 4)
                var d = data
                d['customer'] = this.customerID
                stripe.paymentIntents.create(d).then((paymentIntent) => {
                    console.log(paymentIntent);
                    this.model = model
                    this.model = new this.model()

                    this.model._id = id
                    this.model.profileID = profileID
                    this.model.amount = amount
                    this.model.fee = 0
                    this.model.payerId = profileID
                    this.model.payeeProfileID = payeeProfileID
                    this.model.status = 'INITIATED'
                    this.model.paymentIntentID = paymentIntent.id
                    this.model.collaborationID = collaborationID
                    this.model.initiateTime = new Date().getTime()
                    this.model.save().then((d) => {
                        this.response.send({
                            status: 1,
                            message: 'payment initiated',
                            id: id,
                            data: {
                                amount: data.amount,
                                title: 'FUND VERIFICATION',
                                item: 'VALUE',
                                secrect: paymentIntent.client_secret
                            },

                        })
                    }).catch(err => {
                        this.response.send({ status: 0, message: 'fail to store initiate try later' })
                    })
                }).catch(data => {
                    this.response.send({ status: 0, message: 'fail to initiate' })
                })
            } else {
                this.response.send({ status: 2, message: 'complete payments before you can chat', })
            }
        })
    }
    initiatePayment(data, profileID, payeeProfileID, collaborationID, amount) {
        var model = this.model
        this.model = customers
        this._retriveCustomerID(profileID, (dd) => {
            if (dd === 1) {
                var id = randomstring.generate({ length: 4, charset: 'alphabetic' }) + profileID.substr(0, 4) + payeeProfileID.substr(0, 4) + new Date().getTime().toString().substr(0, 4)
                var d = data
                d['customer'] = this.customerID
                stripe.paymentIntents.create(d).then((paymentIntent) => {
                    console.log(paymentIntent);
                    this.model = model
                        // asynchronously called
                        // stripe.paymentIntents.retrieve(
                        //     paymentIntent.id,
                        //     function(err, paymentIntent) {
                        //         // asynchronously called
                        //     }
                        // );

                    this.model = new this.model()

                    this.model._id = id
                    this.model.profileID = profileID
                    this.model.amount = amount
                    this.model.fee = 10
                    this.model.payerId = profileID
                    this.model.payeeProfileID = payeeProfileID
                    this.model.status = 'INITIATED'
                    this.model.paymentIntentID = paymentIntent.id
                    this.model.collaborationID = collaborationID
                    this.model.initiateTime = new Date().getTime()
                    this.model.save().then((d) => {
                        this.response.send({
                            status: 1,
                            message: 'payment initiated',
                            id: id,
                            data: {
                                amount: data.amount,
                                secrect: paymentIntent.client_secret
                            },

                        })
                    }).catch(err => {
                        this.response.send({ status: 0, message: 'fail to store initiate try later' })
                    })
                }).catch(data => {
                    this.response.send({ status: 0, message: 'fail to initiate' })
                })
            } else {
                this.response.send({ status: 2, message: 'complete payments before you can chat', })
            }
        })
    }

    storeFailDetails(id) {
        var d = {
            status: "FAILED",
            time: new Date().getTime()
        }
        this.model.updateOne({ _id: id }, { $set: d }).then((d) => {
            this.response.send({
                status: 1,
                message: 'payment failed'
            })
        }).catch(d => {
            this.response.send({
                status: 0,
                message: 'cant store data'
            })
        })
    }

    storeTranscationDetails(data, id) {
        var refID = data.id
        var redirect = (data["status"] === 'requires_source_action' || data["status"] === 'requires_action')
        var d = {
            transcationId: data["id"],
            status: data["status"],
            mode: data["payment_method"],
            currency: data["currency"],
            description: data["description"],
            time: new Date().getTime(),
            payment_receipt_url: data["receipt_url"],
        }
        this.model.updateOne({ _id: id }, { $set: d }).then((d) => {
            if (redirect) {
                this.response.send({
                    status: 1,
                    redirect: redirect,
                    clientScrect: data.client_secret,
                    url: data['next_action']['use_stripe_sdk']['stripe_js']
                })
            } else {
                this.response.send({
                    status: 1,
                    redirect: redirect,
                    message: 'transcation successful'
                })
            }
        }).catch((data) => {
            this.response.send({
                status: 0,
                message: 'payment status unknown or on hold please use reference id',
                refID: refID
            })
        })
    }

    _retriveCustomerID(profileID, callBack) {
        console.log(profileID);

        customers.findOne({ profileID: profileID }).then((data) => {
            console.log(data);

            if (data != null) {
                this.customerID = data.customerID
                console.log('here there');
                callBack(1)
            } else {
                console.log('here1 notn ');
                this._createCustomer(profileID, (c) => {
                    console.log(c);

                    if (c === 1) {
                        callBack(1)
                    } else {
                        callBack(0)
                    }
                })

            }
        }).catch((data) => {
            console.log(data);
            callBack(-1)
        })
    }

    checkAndAddCard(data) {
        this._retriveCustomerID(data.profileID, (d) => {
            console.log(d);

            if (d === 1) {
                this.linkCard({ cardToken: data.cardToken, profileID: data.profileID })
            } else if (d === 0) {
                this.response.send({
                    status: 0,
                    message: 'customer not found'
                })
            } else {
                this.response.send({
                    status: 0,
                    message: 'customer not found'
                })
            }
        })

    }

    getTranscationsOnCollaboration(data) {
        var collaborationID = data.id
        this.model.find({ collaborationID: collaborationID }).then((data) => {
            if (data.length > 0) {
                this.response.send({
                    status: 1,
                    message: 'data exist',
                    transcations: data
                })
            } else {
                this.response.send({
                    status: 1,
                    message: 'data not exist'
                })
            }
        }).catch((data) => {
            console.log('error', data);
        })
    }

    getAllTranscations(data) {
        var profileID = data.id
        this.model.find({ profileID: profileID }).then((data) => {
            if (data.length > 0) {
                this.response.send({
                    status: 1,
                    message: 'data exist',
                    transcations: data
                })
            } else {
                this.response.send({
                    status: 1,
                    message: 'data not exist'
                })
            }
        }).catch((data) => {
            console.log('error', data);
        })
    }

    getPaymentStatus(data) {
        var collaborationID = data.id
        this.model.find({ collaborationID: collaborationID }).then((data) => {
            if (data.length > 0) {
                var amount = 0
                var status = false
                data.forEach(e => {
                    amount += (e.amount / 100)
                    status = status === 'SUCCEEDED' ? true : false
                })
                this.response.send({
                    status: 1,
                    message: 'data exist',
                    data: {
                        amount: amount,
                        status: status
                    }
                })
            } else {
                this.response.send({
                    status: 1,
                    message: 'data not exist'
                })
            }
        }).catch((data) => {
            console.log('error', data);
        })
    }

    ocInit(data) {
        this._retriveCustomerID(data.profileID, (dd) => {
            if (dd === 1) {
                var id = randomstring.generate({ length: 8, charset: 'alphabetic' }) + data.profileID.substr(0, 4) + new Date().getTime().toString().substr(0, 4)
                axios.get('https://seedbank.theotherfruit.io/getPrice/' + data.listingID).then((res) => {
                    console.log(res.data);

                    if (res.data.status === 1) {
                        var d = {
                            amount: ((res.data.data.price) * 100) + 1000,
                            currency: 'usd',
                            payment_method_types: ['card'],
                            customer: this.customerID
                        }
                        stripe.paymentIntents.create(d).then((paymentIntent) => {
                            console.log(paymentIntent);
                            this.model = new this.model()
                            this.model._id = id
                            this.model.profileID = data.profileID
                            this.model.amount = d.amount
                            this.model.fee = 1000
                            this.model.payerId = data.profileID
                                // this.model.payeeProfileID = payeeProfileID
                            this.model.status = 'INITIATED'
                            this.model.paymentIntentID = paymentIntent.id
                            this.model.collaborationID = data.listingID
                            this.model.initiateTime = new Date().getTime()
                            this.model.save().then((d) => {
                                this.response.send({
                                    status: 1,
                                    message: 'payment initiated',
                                    id: id,
                                    data: {
                                        amount: d.amount,
                                        title: 'OPEN COLLABORATION VERIFICATION',
                                        item: 'VALUE',
                                        secrect: paymentIntent.client_secret
                                    },

                                })
                            }).catch(err => {
                                console.log(err);

                                this.response.send({ status: 0, message: 'fail to store initiate try later' })
                            })
                        }).catch(data => {
                            console.log(data);

                            this.response.send({ status: 0, message: 'fail to initiate' })
                        })
                    }
                }).catch((error) => {
                    this.response.send({ status: 1, message: 'error in fetching data' })
                    console.error(error)
                })
            } else {
                this.response.send({ status: 2, message: 'complete payments before you can chat', })
            }
        })
    }

    verifyPayment(id) {
        this.model.findOne({ _id: id }).then((data) => {
                console.log(data);

                if (data != null) {
                    stripe.paymentIntents.retrieve(
                        data.paymentIntentID
                    ).then((intentData) => {
                        if (intentData.status === 'succeeded') {
                            axios.get('https://seedbank.theotherfruit.io/addToInterested/' + data.collaborationID + '/' + data.payerId).then((res) => {
                                console.log(res);
                                this.response.send({ status: 1, sellerID: res.data.data.profileID })
                            }).catch((error) => {
                                this.response.send({ status: 0, message: 'error in updating' })
                                console.error(error)
                            })
                        } else {
                            this.response.send({
                                status: 0,
                                message: 'cant complete try later'
                            })
                        }
                    })
                } else {
                    this.response.send({
                        status: 0,
                        message: 'cant complete try later'
                    })
                }
            }).catch((err) => {
                this.response.send({
                    status: 0,
                    message: 'cant complete try later'
                })
            })
            // .

    }

    pcInit(data) {
        this._retriveCustomerID(data.profileID, (dd) => {
            if (dd === 1) {
                var id = randomstring.generate({ length: 8, charset: 'alphabetic' }) + data.profileID.substr(0, 4) + new Date().getTime().toString().substr(0, 4)
                axios.get('https://h2o.theotherfruit.io/getCollaboration/' + data.listingID).then((res) => {
                    console.log(res.data);

                    if (res.data.status === 1) {
                        var d = {
                            amount: ((res.data.data.price) * 100) + (((res.data.data.price) * 0.1) * 100) + 999,
                            currency: 'usd',
                            payment_method_types: ['card'],
                            customer: this.customerID
                        }
                        stripe.paymentIntents.create(d).then((paymentIntent) => {
                            console.log(paymentIntent);
                            this.model = new this.model()
                            this.model._id = id
                            this.model.profileID = data.profileID
                            this.model.amount = d.amount
                            this.model.fee = 999
                            this.model.payerId = data.profileID
                                // this.model.payeeProfileID = payeeProfileID
                            this.model.status = 'INITIATED'
                            this.model.paymentIntentID = paymentIntent.id
                            this.model.collaborationID = data.listingID
                            this.model.initiateTime = new Date().getTime()
                            this.model.save().then((d) => {
                                this.response.send({
                                    status: 1,
                                    message: 'payment initiated',
                                    id: id,
                                    data: {
                                        amount: d.amount,
                                        collaborationAmount: (res.data.data.price * 100),
                                        gauranteeAmount: (res.data.data.price * 0.1) * 100,
                                        serviceFee: 999,
                                        title: res.data.data.collaborationDescription,
                                        item: 'RWSC',
                                        secrect: paymentIntent.client_secret
                                    },

                                })
                            }).catch(err => {
                                console.log(err);

                                this.response.send({ status: 0, message: 'fail to store initiate try later' })
                            })
                        }).catch(data => {
                            console.log(data);

                            this.response.send({ status: 0, message: 'fail to initiate' })
                        })
                    }
                }).catch((error) => {
                    this.response.send({ status: 1, message: 'error in fetching data' })
                    console.error(error)
                })
            } else {
                this.response.send({ status: 2, message: 'complete payments before you can chat', })
            }
        })
    }

    pcUpdate(GD) {
        console.log(GD);

        this.model.findOne({ collaborationID: GD.collaborationID }).then(data => {
            if (data != null) {
                axios.get('https://h2o.theotherfruit.io/makeInsured/' + data.collaborationID + '/' + GD.gntee).then((rrs) => {
                    console.log(rrs);

                    if (rrs.data.status === 1) {
                        axios.get('https://h2o.theotherfruit.io/getCollaboration/' + data.collaborationID).then((res) => {
                            if (res.data.status === 1) {
                                var amount = ((res.data.data.price) * 100) + 999
                                if (GD.gntee === 'true') {
                                    amount = ((res.data.data.price) * 100) + 999 + ((res.data.data.price * 0.1) * 100)
                                } else {
                                    amount = 999
                                }
                                stripe.paymentIntents.update(
                                    data.paymentIntentID, { amount: amount }).then((paymentIntentData) => {
                                    this.model.findOneAndUpdate({ collaborationID: GD.collaborationID }, { $set: { amount: amount } }).then(modeData => {
                                        this.response.send({
                                            status: 1,
                                            message: 'updated',
                                            data: {
                                                amount: amount,
                                                collaborationAmount: (res.data.data.price * 100),
                                                gauranteeAmount: (res.data.data.price * 0.1) * 100,
                                                serviceFee: 999,
                                                title: res.data.data.collaborationDescription,
                                                item: 'RWSC',
                                                secrect: paymentIntentData.client_secret
                                            }
                                        })
                                    }).catch(data => {
                                        console.log(data);

                                        this.response.send({ status: 0, message: 'error in fetching data 1' })
                                    })
                                }).catch((err) => {
                                    console.log(err);

                                    this.response.send({ status: 0, message: 'error in fetching data 2' })
                                })
                            }
                        }).catch(err => {
                            console.log(err);

                            this.response.send({ status: 0, message: 'error in fetching data 3' })
                        })
                    }
                }).catch(err => {
                    console.log(err);

                    this.response.send({ status: 0, message: 'error in fetching data 3' })
                })

            } else {
                this.response.send({ status: 0, message: 'error in fetching data 4' })
            }
        })

    }
    verifyPCPayment(id) {
        this.model.findOne({ _id: id }).then((data) => {
                console.log(data);

                if (data != null) {
                    stripe.paymentIntents.retrieve(
                        data.paymentIntentID
                    ).then((intentData) => {
                        if (intentData.status === 'succeeded') {
                            axios.get('https://h2o.theotherfruit.io/paymentSuccessCollaboration/' + data.collaborationID + '/' + data.payerId).then((res) => {
                                console.log(res);
                                this.response.send({ status: 1, sellerID: res.data.data.sellerProfileID })
                            }).catch((error) => {
                                this.response.send({ status: 0, message: 'error in updating' })
                                console.error(error)
                            })
                        } else {
                            this.response.send({
                                status: 0,
                                message: 'cant complete try later'
                            })
                        }
                    })
                } else {
                    this.response.send({
                        status: 0,
                        message: 'cant complete try later'
                    })
                }
            }).catch((err) => {
                this.response.send({
                    status: 0,
                    message: 'cant complete try later'
                })
            })
            // .

    }

    _initInvoice(data, callBack) {
        console.log(data);

        invoiceModel.findOne({ invoiceTypeID: data.invoiceTypeID }).then(d => {
            if (d === null) {
                let invoiceObj = new invoiceModel()
                invoiceObj.invoiceID = randomstring.generate({ length: 12, charset: 'alphanumeric' }) + new Date().getTime().toString().substr(0, 4)
                invoiceObj.timeStamp = new Date().getTime()
                invoiceObj.status = 'INITIATED'
                invoiceObj.profileID = data.profileID
                invoiceObj.invoiceType = data.invoiceType
                invoiceObj.invoiceTypeID = data.invoiceTypeID
                invoiceObj.title = data.title
                invoiceObj.description = data.description
                invoiceObj.thumblain = data.thumblain
                invoiceObj.payeeID = data.payeeID
                invoiceObj.location = data.location
                invoiceObj.sessions = data.sessions
                invoiceObj.isExtended = data.isExtended
                invoiceObj.invoiceTotal = data.total
                if (invoiceObj.isExtended) {
                    invoiceObj.extendedSessions = data.extendedSessions
                }
                invoiceObj.save({ new: true }).then((invoiceData) => {
                    console.log(invoiceData);

                    callBack({ status: 1, data: invoiceData, message: 'invoice data found' })
                }).catch((data) => {
                    console.log(data);

                    callBack({ status: 0, message: 'internal error' })
                })
            } else {
                callBack({ status: 1, data: d, message: 'invoice data found' })
            }
        }).catch(data => {
            console.log(data);

            callBack({ status: 0, message: 'internal error' })
        })
    }

    _fetchInvoice(data, callBack) {
        invoiceModel.findOne({ invoiceTypeID: data }).then(data => {
            if (data != null) {
                callBack({ status: 1, data: data, message: 'invoice data found' })
            } else {
                callBack({ status: 0, message: 'invoice data not found' })
            }
        }).catch(data => {
            callBack({ status: 0, message: 'internal error' })
        })
    }

    _addInvoiceSessions(id, data, callBack) {

        invoiceModel.findOne({ invoiceID: id }).then(invData => {
            if (invData != null) {
                var amount = invData.invoiceTotal
                if (data.type === 'add') {
                    amount += data.amount
                } else if (data.type === 'deduct') {
                    amount -= data.amount
                }
                invoiceModel.findOneAndUpdate({ invoiceID: id }, { $push: { others: data }, $set: { invoiceTotal: amount } }).then(data => {
                    callBack({ status: 1, message: 'sessions updated', data: data })
                }).catch((err) => {
                    callBack({ status: 0, message: 'internal error' })
                })
            } else {
                callBack({ status: 0, message: 'internal error' })
            }
        }).catch(err => {
            callBack({ status: 0, message: 'internal error' })
        })
    }
}

module.exports = Payments