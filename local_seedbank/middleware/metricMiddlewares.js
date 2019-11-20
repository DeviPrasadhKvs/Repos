const {sendRequestMetrics} = require('../socketControllers/registerServiceController')

var sendRequestMetricsMiddleware = (req, res, next)=>{
    let metrics = {
        ip : req.ip,
        path : req.path,
    }
    // console.log(metrics);
    
    sendRequestMetrics(metrics)
    next()
}

module.exports = {
    sendRequestMetricsMiddleware
}
