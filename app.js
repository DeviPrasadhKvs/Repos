const express = require('express')
const app = express()
const initDB = require('./db')
const apiResponse = require('./utils/response')
var md5 = require('md5');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var portalController = require('./controller/portalController');

const signUpCMS = require('./models/signUpCMSmodel');
const userSignUpCMS = require('./models/userSignUpCMSmodel');

portalController(app, apiResponse, signUpCMS, userSignUpCMS, md5);

initDB(() => {
    app.listen(4000, (err, res) => {
        console.log('Connection Established');
    })
})