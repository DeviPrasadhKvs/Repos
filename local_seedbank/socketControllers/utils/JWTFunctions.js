const Promise = require('bluebird')
const fs = require('fs')
const jwt = require('jsonwebtoken')

module.exports.createJWT = function createJWT(){
    return new Promise((resolve, reject)=>{
        console.log(__dirname);
        
        var pvkey = fs.readFileSync(__dirname + '/../../keys/privateKey.pem', {encoding : 'utf8'})
        userToken = jwt.sign({
            name : process.env.NAME,
        },
        pvkey,
        {
            expiresIn: 100,
            algorithm: 'RS256'
        },
        (err, token)=>{
            if(err){
                reject(err)
            }else{
                resolve(token)
            }
        })


    })
}


