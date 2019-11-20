const Promise = require('bluebird')
const { generateKeyPair } = require('crypto');
const fs = require('fs')


module.exports.genKeyPair = function genKeyPair(){
    return new Promise((resolve, reject)=>{

        generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem'
            }
          }, (err, publicKey, privateKey) => {
            if(err){
                reject(err)
                
            }
            else{
                fs.writeFile(__dirname + '/../../keys/privateKey.pem',privateKey , 'utf8', (err)=>{
                    if(err){
                        throw err
                    }
                    fs.writeFile(__dirname + '/../../keys/publicKey.pem', publicKey ,'utf8', (err)=>{
                        if(err) throw err;
                        resolve(publicKey)
                    })
                })
            }
          });
    })
}