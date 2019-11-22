require('dotenv').config()

const express = require('express');
const initDB = require('./mongoConfig/connection');
const app = express();
var path = require('path');
const internalIp = require('internal-ip');
const https = require('https');
const fs = require('fs');
var helmet = require('helmet')
const {
    sendRequestMetricsMiddleware
} = require('./middleware/metricMiddlewares');
const { validationResult } = require('express-validator');

var cors = require('cors');
app.use(cors());
app.use(sendRequestMetricsMiddleware);

app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use('/public', express.static(path.join(__dirname + 'public')));






// provinance
var keyStoreModel = require('./models/keyStoreModel')
var keyStoreController = require('./keyControllers/keyStoreController')

var jwt = require('jsonwebtoken');
const axios = require('axios');
const transport = axios.create({
    withCredentials: true
})


app.use('/public', express.static(path.join(__dirname + 'public')));


// NOTIFICATION SERVICE : CODE TO BE COPIED

const notify = require('./notificationControllers/sendNotification')
    // NOTIFICATION SERVICE : CODE TO BE COPIED TILL HERE





// provenance
var keyStoreModel = require('./models/keyStoreModel')
var keyStoreController = require('./keyControllers/keyStoreController')



// PAYMENT PART STARTS

let payments = require('./models/payments-schema');
let customers = require('./models/customers-schema');
let fundVerfication = require('./models/fundVerification');
let copyRightTemp = require('./models/copyrightTemp');
let paymentsController = require('./payment-controller/payment-controller');
paymentsController(app, payments, customers, fundVerfication, copyRightTemp)


// PAYMENT PART ENDS

const apiResponse = require('./utils/response');
const profileDataModel = require('./models/profileDataModel');
const listingModel = require('./models/listing-schema');
const bookmarkModel = require('./models/bookmarkModel')
const sellingListingModel = require('./models/selling-listing-schema')
const copyrightListingModel = require('./models/copyright-listing-scema')
const disputeModel = require('./models/disputeModel')
const statusModel = require('./models/statusModels')
const KYCModel = require('./models/kycModel')
const calendarModel = require('./models/calendarModel')
const imagesModel = require('./models/imageSchema')
const typesModel = require('./models/typemodel')
const locationModel = require('./models/locationModel')
const preferencesModel = require('./models/preferencesModel')
const userModel = require('./models/userModel')
const refreshTokenModel = require('./models/refreshTokenModel')
const sessionTimerModel = require('./models/collaborationModels/sessionTimerModel')


const createprofileController = require('./controllers/createProfileController');
const connectionController = require('./controllers/connectionController');
const mapController = require('./mapController/mapController');
const profileController = require('./profileController/profileController');
const listingController = require('./listing-controller/listing-controller');
const copyrightListingController = require('./listing-controller/copyright-listing-controller');
const sellingListingController = require('./listing-controller/selling-listing-controller');
const bookmarkController = require('./bookmark-controller/bookmarkController')
const termsModel = require('./models/termsModel')
const tailorTerms = require('./models/tailorTermsModel')
const disputecontroller = require('./disputeControllers/disputeController')
const registrationFuntions = require('./registrationController/registrationFunctions')
const sessionTimerController = require('./collaborationController/sessionTimerController')

const profileFilterController = require('./profileController/filterController')
const profileFunctionsController = require('./profileController/profileFunctions')
var registerServiceController = require('./socketControllers/registerServiceController');

registrationFuntions(app, userModel, profileDataModel, locationModel, preferencesModel, apiResponse, validationResult)

profileFunctionsController(app, profileDataModel, apiResponse, termsModel, listingModel, KYCModel, imagesModel, statusModel, preferencesModel, calendarModel, locationModel, typesModel, tailorTerms)
createprofileController(app, profileDataModel, locationModel, preferencesModel, apiResponse, statusModel, validationResult);
connectionController(app, profileDataModel, apiResponse, preferencesModel, validationResult);
profileController(app, profileDataModel, apiResponse, preferencesModel, locationModel, notify);
mapController(app, profileDataModel, apiResponse);
listingController(app, listingModel, apiResponse, locationModel, calendarModel, preferencesModel);
copyrightListingController(app, copyrightListingModel, apiResponse, validationResult);
sellingListingController(app, sellingListingModel, apiResponse, validationResult);
bookmarkController(app, bookmarkModel, apiResponse, validationResult)
profileFilterController(app, profileDataModel, apiResponse)
disputecontroller(app, disputeModel, profileDataModel, apiResponse, validationResult)
keyStoreController(app, apiResponse, keyStoreModel, statusModel, validationResult)
sessionTimerController(app, sessionTimerModel)



// GLOBE CODE

globeModel = require('./models/GlobeModels/globeModel')
globeController = require('./globeControllers/globeController')
globeController(app, globeModel)


// GLOBE CODE

// console.log(process.env.NODE_ENV)
if (process.env.ENV == 'dev') {
    console.log('running on ENV', process.env.ENV)
    initDB(() => {
        app.listen(4000, () => {
            console.log(`Connection established on Port: ${4000}`);
        });
    })

} else {
    initDB(() => {
        https.createServer({
            key: fs.readFileSync('/etc/letsencrypt/live/seedbank.theotherfruit.io/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/seedbank.theotherfruit.io/cert.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/seedbank.theotherfruit.io/chain.pem')
        }, app).listen(443, () => {
            console.log('Listening on 443')
            console.log(internalIp.v4.sync())
            registerServiceController.registerService(internalIp.v4.sync(), process.env.DOMAIN)
        })
    })
}