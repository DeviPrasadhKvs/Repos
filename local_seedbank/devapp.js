require('dotenv').config()

const express = require('express')
const initDB = require('./mongoConfig/connection')
const app = express()
var path = require('path')
const internalIp = require('internal-ip');
const https = require('https')
const fs = require('fs')
const { sendRequestMetricsMiddleware } = require('./middleware/metricMiddlewares')

var cors = require('cors')
app.use(cors())
app.use(sendRequestMetricsMiddleware)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname + 'public')));

const profileDataModel = require('./models/profileDataModel')
const createprofileController = require('./controllers/createProfileController')
const connectionController = require('./controllers/connectionController')
const mapController = require('./mapController/mapController')
const profileController = require('./profileController/profileController')


var registerServiceController = require('./socketControllers/registerServiceController')
var errorLoggerController = require('./socketControllers/errorLogger')

const artistData = require('./models/artistDataModel')

createprofileController(app, profileDataModel, errorLoggerController)
connectionController(app, profileDataModel, errorLoggerController)
profileController(app, profileDataModel, errorLoggerController);
mapController(app, artistData, errorLoggerController)



// initDB(()=>{
//     https.createServer({
//         key: fs.readFileSync('/etc/letsencrypt/live/seedbank.theotherfruit.io/privkey.pem'),
//         cert: fs.readFileSync('/etc/letsencrypt/live/seedbank.theotherfruit.io/cert.pem'),
//         ca: fs.readFileSync('/etc/letsencrypt/live/seedbank.theotherfruit.io/chain.pem')
//       }, app).listen(443, () => {
//         console.log('Listening on 443')
//         console.log(internalIp.v4.sync())
//         registerServiceController.registerService(internalIp.v4.sync(), process.env.DOMAIN)
//       })
//     })



initDB(() => {
    app.listen(3300, () => {

        console.log('server started on 3300');
        // console.log(internalIp.v4.sync())
        // registerServiceController.registerService(internalIp.v4.sync(), process.env.DOMAIN)


    })
})


// const {class2} = require('./test')

// classins = new class2(5)

// console.log(classins.getx());