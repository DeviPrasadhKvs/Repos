var fs = require('fs')
var jwt = require('jsonwebtoken');
const axios = require('axios');
const apiResponse = require('../utils/response');
const transport = axios.create({
    withCredentials: true
  })


  var isLoggedIn =  (req, res, next)=>{
    // console.log(req.headers);
    user_token = req.headers.authorization
    console.log(user_token);
    
    if(!user_token){
        return res.status(401).send(apiResponse.sendReply(0, 'Token not provided'))
    }else{
        var pbkey = fs.readFileSync('./keys/publicKey.pem', {encoding:'utf8'})
        jwt.verify(user_token, pbkey, { algorithm : 'RS256'}, (err, decoded)=>{
            if(err){
                if(err.name == 'TokenExpiredError'){
                    console.log('expired');
                    transport.get('http://127.0.0.1:4000/refreshtoken', { headers : {
                    authorization : user_token}})
                    .then(response=>{
                        console.log(response.data);
                        res.locals.newToken = response.data.userToken
                        next()
                    }).catch(err=>{
                        console.log(err.response.data);
                        res.send(err.response.data)
                        })
                    
                }else{
                    return res.status(401).send(apiResponse.sendReply(0, 'JWT Error'))
                }
                
            }else{
                res.locals.newToken = user_token
                next()              
            } 
        })
}
}
module.exports = {
    isLoggedIn
}