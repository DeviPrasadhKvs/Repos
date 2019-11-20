module.exports = (app, globeModel)=>{

    app.get('/fetchallpins', (req, res)=>{
        globeModel.find({}, 'lat lng', (err, doc)=>{
            if(err){
                console.log(err);
            }else{
                console.log(doc);
                res.send(doc)
                
            }
        })
    })

}