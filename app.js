const express = require('express')
const app = express()
const initDB = require('./db')
var md5 = require('md5');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var portalController = require('./controller/portalController');

const signUpCMS = require('./models/signUpCMSmodel');
const loginCMS = require('./models/loginCMSmodel');

portalController(app, signUpCMS, loginCMS, md5);

initDB(() => {
    app.listen(4000, (err, res) => {
        console.log('Connection Established');
    })
})