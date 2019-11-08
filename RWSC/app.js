const express = require('express')
const app = express()
const mongoose = require('mongoose')
const initDB = require('./db')
var cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var dbController = require('./controller/dbController')

var rwscDb = require('./models/rwscModel')
var rwscUsersDb = require('./models/rwscUserModel')

dbController(app, rwscDb, rwscUsersDb)

initDB(() => {
    app.listen(4000, (err, res) => {
        console.log('Connection Established');
    })
})