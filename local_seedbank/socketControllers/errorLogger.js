// const socket = require('socket.io-client')('http://127.0.0.1/error', {query : {secret:process.env.RESONANCESECRET, name : process.env.NAME}, multiplex: false});
const socket = require('socket.io-client')('https://resonance.theotherfruit.io/error', {query : {secret:process.env.RESONANCESECRET, name : process.env.NAME}, multiplex: false});

socket.on('connect', ()=>{
    console.log('connected-client logger service');
})


var reportError = (data)=>{
    console.log('here');
    console.log(data.message);
    
    
    socket.emit('reportError', {error : Buffer.from(data.stack), message: Buffer.from(data.message), from: process.env.NAME, timestamp: Date.now()})
}

module.exports = {
    reportError
}