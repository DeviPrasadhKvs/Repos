const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false)



module.exports = function initDB(cb){

  if(process.env.ENV == 'dev'){
    mongoose.connect(process.env.MONGO_DB_CONNECT_LOCAL_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.connection.once('open', ()=>{
        console.log('connected to local DB');
        cb();
    }).on('error', (err)=>{
        console.log('err', err)
    })
  }else if (process.env.ENV == 'production'){
    mongoose.connect(process.env.MONGO_DB_CONNECT_STRING, { useNewUrlParser: true })
    mongoose.connection.once('open', ()=>{
        console.log('connected to DB');
        cb();
    }).on('error', (err)=>{
        console.log('err', err)
    })
  }
}
