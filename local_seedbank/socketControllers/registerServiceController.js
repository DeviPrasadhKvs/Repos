

let {genKeyPair} = require('./utils/keyFunctions')
const {cpuAverage} = require('./utils/CPUFunctions')
const socket = require('socket.io-client')('https://resonance.theotherfruit.io/registerservice', {query : {secret:process.env.RESONANCESECRET, name : process.env.NAME}, multiplex: false});
// const socket = require('socket.io-client')('http://127.0.0.1/registerservice', {query : {secret:process.env.RESONANCESECRET, name : process.env.NAME}, multiplex: false});
const internalIp = require('internal-ip');
const os = require('os')



socket.on('connect', ()=>{
    // console.log('connected-client register service');
})
socket.on(process.env.NAME, (data)=>{
    console.log(data);
})

var sendRequestMetrics = (metrics)=>{

    socket.emit('requestMetrics', {name: process.env.NAME, metrics})

}

function CPUUsage(){
    var startMeasure = cpuAverage();
    return new Promise((resolve, reject)=>{
        setTimeout(function() { 

  //Grab second Measure
  var endMeasure = cpuAverage(); 

  //Calculate the difference in idle and total time between the measures
  var idleDifference = endMeasure.idle - startMeasure.idle;
  var totalDifference = endMeasure.total - startMeasure.total;

  //Calculate the average percentage CPU usage
  var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

  //Output result to console
  resolve(percentageCPU)

}, 100);
        
    })
}

function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue;
 } 

socket.on('heartbeat?', ()=>{
    CPUUsage().then(CPUPercent=>{
        socket.emit('heartbeat', {
            timestamp : (new Date).getTime(),
            name : process.env.NAME,
            memory : process.memoryUsage(),
            platform: os.platform(),
            totalMemory: os.totalmem(),
            upTime: process.uptime(),
            freeMemory: os.freemem(),
            CPUPercent,
            heaptotal:process.memoryUsage().heapTotal,
            memoryUsage: Math.round(percentage(os.freemem(), os.totalmem())),
            domain: process.env.DOMAIN,
            ip: internalIp.v4.sync(),
            heapUsage: Math.round(percentage(process.memoryUsage().heapUsed, process.memoryUsage().heapTotal)),
    
        })
    })
})


// socket.emit('registerService', {name : Buffer.from(process.env.name), pbkey : Buffer.from(pbkey), secret : Buffer.from(process.env.FIRSTSECRET)})

var registerService = function (ip, DOMAIN){
        socket.emit('registerService', {name : Buffer.from(process.env.NAME), ip, DOMAIN, secret : Buffer.from(process.env.FIRSTSECRET)})

}

module.exports = {
    registerService,
    sendRequestMetrics
}