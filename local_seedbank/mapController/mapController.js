require('dotenv').config()

var fs = require('fs');

module.exports = (app, artistData) => {

    app.get('/globe', function(req, res) {
        artistData.find({}).then((data, err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(data)
                }
            })
            // res.render('globe')
    })

    app.get('/maps', (req, res) => {
        var city = req.query.city
        var country = req.query.country
        console.log(city + " " + country)
        artistData.find({ $and: [{ city: { $regex: city, $options: "i" } }, { country: { $regex: country, $options: "i" } }] }).then((data, err) => {
            if (err) {
                console.log(err)
            } else {

                data.forEach(dataitem => {
                    id = dataitem._id
                    var directoryPath = "public/uploads/" + id + "/"
                    var filenames = fs.readdirSync(directoryPath)
                    dataitem._doc.images = filenames
                    dataitem._doc.imageLocation = "0464a126.ngrok.io/uploads/" + id + "/";
                })
                res.send(data)
            }
        })
    })

}