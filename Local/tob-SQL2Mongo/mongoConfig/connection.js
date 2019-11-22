const mongoose = require('mongoose')
require('dotenv').config()
module.exports = function initDB(cb) {
    mongoose.connect(process.env.MONGO_DB_CONNECT_STRING, { useNewUrlParser: true })
    mongoose.connection.once('open', () => {
        console.log('connected to DB');
        cb();
    }).on('error', (err) => {
        console.log('err')
    })
}