let mongoose = require('mongoose');

module.exports = (callback => {
    let db = mongoose.connect('mongodb+srv://devi:qwerty12345@cluster0-i8xqe.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
    callback(db);
    let mydb = mongoose.connection;
    mydb.once('open', (data) => {
        console.log('connected');
    })
    mydb.on('error', console.error.bind(console, 'Error with Mongo connection'));
});