let socket;

if (process.env.NODE_ENV == 'dev') {
    socket = require('socket.io-client')('http://127.0.0.1/error', { query: { secret: process.env.RESONANCESECRET, name: process.env.NAME }, multiplex: false });
} else {
    socket = require('socket.io-client')('http://resonance.theotherfruit.io/error', { query: { secret: process.env.RESONANCESECRET, name: process.env.NAME }, multiplex: false });
}


var sendReply = (status, message, data) => {

    let reply;
    if (data) {
        reply = {
            status,
            message,
            data
        }
    } else {
        reply = {
            status,
            message
        }
    }
    return reply

}


var reportError = (error) => {
    console.log('here');
    console.log(error);
    socket.emit('reportError', { error: Buffer.from(error.stack), message: Buffer.from(error.message), from: process.env.NAME, timestamp: Date.now() })
}

module.exports = {
    reportError,
    sendReply
}