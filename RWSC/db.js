const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false)

module.exports = function initDB(cb) {
    mongoose.connect('mongodb+srv://devi:qwerty12345@cluster0-i8xqe.gcp.mongodb.net/RWSC', { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.connection.once('open', () => {
        console.log('Connected to Mongo');
        cb();
    }).on('error', (err) => {
        console.log('err')
    })
}