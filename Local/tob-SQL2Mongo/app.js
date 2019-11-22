const express = require('express')
const mongoose = require('mongoose')
const initDB = require('./mongoConfig/connection')

const app = express()
var cors = require('cors')
app.use(cors())


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const artistsModel = require('./models/artistsTable')
const artistsDB = mongoose.model('artists', artistsModel);
const tattooDB = mongoose.model('tattoo', artistsModel)
const piercing = mongoose.model('piercing', artistsModel)
const vendors = mongoose.model('vendors', artistsModel)
const bodyMOD = mongoose.model('bodyMOD', artistsModel)
const suppliers = mongoose.model('suppliers', artistsModel)
const venues = mongoose.model('venues', artistsModel)
const providers = mongoose.model('providers', artistsModel)
const models = mongoose.model('models', artistsModel)
const business = mongoose.model('business', artistsModel)
const prfmORartists = mongoose.model('prfmORartists', artistsModel)

const artistController = require('./controllers/artistController')

artistController(app, artistsDB, tattooDB, piercing, vendors, bodyMOD, suppliers, venues, providers, models, business, prfmORartists)



initDB(()=>{
    app.listen(4300, (err, res)=>{
        console.log('server started on 4300');

    })
})