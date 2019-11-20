// const socket = require('socket.io-client')('http://127.0.0.1:8000/notify');
const socket = require('socket.io-client')('https://lighthouse.theotherfruit.io/notify');
socket.on('connect', function() {
    console.log('connected');

});

var send = (to, type, data) => {
    console.log('here');

    var dataToNotify = {
        to,
        type,
        data,
    }

    socket.emit('send-notification', dataToNotify)
}

module.exports = {
    send
}