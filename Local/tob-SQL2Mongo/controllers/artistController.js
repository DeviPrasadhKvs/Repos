const readXlsxFile = require('read-excel-file/node');
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tattoo"
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
module.exports = (app, artistDB, tattooDB, piercing, vendors, bodyMOD, suppliers, venues, providers, models, business, prfmORartists) =>{
    app.get('/artists', (req,res)=>{
        con.query("SELECT * FROM artist_db_basev1", function (err, result, fields) {
            if (err) throw err;
            console.log(result[0]);
            result.forEach(row => {
                artists = new artistDB()
                artists.name = row.name.trim()
                artists.location = row.location.trim() || ""
                artists.website = row.website.trim() || ""
                artists.email = row.email.trim() || ""
                artists.facebook = row.facebook.trim() || ""
                artists.instagram = row.instagram.trim() || ""
                artists.twitter = row.twitter.trim() || ""
                artists.phone = row.phone.trim() || ""
                artists.save().then(()=>{
                  console.log('saved');
                }).catch(e=>{
                    console.log(e);
                    res.status(500).send(e)
                })
            });
            res.status(200).send("artist data dumped to mongoose")
          });
    })

    app.get('/tattoo', (req,res)=>{
      con.query("SELECT * FROM newdata1", function (err, result, fields) {
          if (err) throw err;
          console.log(result[0]);
          result.forEach(row => {
              artists = new tattooDB()
              artists.name = row.name.trim() 
              artists.location = row.location.trim() || ""
              artists.website = row.website.trim() || ""
              artists.email = row.email.trim() || ""
              artists.facebook = row.facebook.trim() || ""
              artists.instagram = row.instagram.trim() || ""
              artists.twitter = row.twitter.trim() || ""
              artists.phone = row.phone.trim()  || ""
              artists.save().then(()=>{
              }).catch(e=>{
                  console.log(e);
                  res.status(500).send(e)
              })
          })
          res.status(200).send("tattoo data dumped to mongoose")
        });
    })

    app.get('/vendors', (req,res)=>{
      con.query("SELECT * FROM vendors", function (err, result, fields) {
          if (err) throw err;
          console.log(result[0]);
          result.forEach(row => {
              artists = new vendors()
              artists.name = row.name.trim() 
              artists.location = row.location.trim() || ""
              artists.website = row.website.trim() || ""
              artists.email = row.email.trim() || ""
              artists.facebook = row.facebook.trim() || ""
              artists.instagram = row.instagram.trim() || ""
              artists.twitter = row.twitter.trim() || ""
              artists.phone = row.phone.trim()  || ""
              artists.save().then(()=>{
              }).catch(e=>{
                  console.log(e);
                  res.status(500)
                  res.send(e)
              })
          })
          res.status(200).send("vendors data dumped to mongoose")
        });
    })

    app.get('/piercing', (req,res)=>{
      con.query("SELECT * FROM piercing", function (err, result, fields) {
          if (err) throw err;
          console.log(result[0]);
          result.forEach(row => {
              artists = new piercing()
              artists.name = row.name.trim() 
              artists.location = row.location.trim() || ""
              artists.website = row.website.trim() || ""
              artists.email = row.email.trim() || ""
              artists.facebook = row.facebook.trim() || ""
              artists.instagram = row.instagram.trim() || ""
              artists.twitter = row.twitter.trim() || ""
              artists.phone = row.phone.trim()  || ""
              artists.save().then(()=>{
              }).catch(e=>{
                  console.log(e);
                  res.status(500)
                  res.send(e)
              })
          });
          res.status(200).send("piercing data dumped to mongoose")
        });
    })

    app.get('/bodyMOD', (req,res)=>{
      con.query("SELECT * FROM body_mod_db_basev1", function (err, result, fields) {
          if (err) throw err;
          console.log(result[0]);
          result.forEach(row => {
              artists = new bodyMOD()
              artists.name = row.name.trim() 
              artists.location = row.location.trim() || ""
              artists.website = row.website.trim() || ""
              artists.email = row.email.trim() || ""
              artists.facebook = row.facebook.trim() || ""
              artists.instagram = row.instagram.trim() || ""
              artists.twitter = row.twitter.trim() || ""
              artists.phone = row.phone.trim()  || ""
              artists.save().then(()=>{
              }).catch(e=>{
                  console.log(e);
                  res.status(500).send(e)
              })
          });
          res.status(200).send("bodyMOD data dumped to mongoose")
        });
    })


    app.get('/venues', (req,res)=>{
      con.query("SELECT * FROM venue_db_basev1", function (err, result, fields) {
          if (err) throw err;
          console.log(result[0]);
          result.forEach(row => {
              artists = new venues()
              artists.name = row.name.trim() 
              artists.location = row.location.trim() || ""
              artists.website = row.website.trim() || ""
              artists.email = row.email.trim() || ""
              artists.facebook = row.facebook.trim() || ""
              artists.instagram = row.instagram.trim() || ""
              artists.twitter = row.twitter.trim() || ""
              artists.phone = row.phone.trim()  || ""
              artists.save().then(()=>{
              }).catch(e=>{
                  console.log(e);
                  res.status(500).send(e)
              })
          });
          res.status(200).send("venues data dumped to mongoose")

        });
    })



    app.get('/models', (req,res)=>{
      con.query("SELECT * FROM models_db_basev1", function (err, result, fields) {
          if (err) throw err;
          console.log(result[0]);
          result.forEach(row => {
              artists = new models()
              artists.name = row.name.trim() 
              artists.location = row.location.trim() || ""
              artists.website = row.website.trim() || ""
              artists.email = row.email.trim() || ""
              artists.facebook = row.facebook.trim() || ""
              artists.instagram = row.instagram.trim() || ""
              artists.twitter = row.twitter.trim() || ""
              artists.phone = row.phone.trim()  || ""
              artists.save().then(()=>{
              }).catch(e=>{
                  console.log(e);
                  res.status(500).send(e)
              })
          });
          res.status(200).send("models data dumped to mongoose")          
        });
    })


    app.get('/prfmORartists', (req,res)=>{
      con.query("SELECT * FROM prfm_artist_db_basev1", function (err, result, fields) {
          if (err) throw err;
          console.log(result[0]);
          result.forEach(row => {
              artists = new prfmORartists()
              artists.name = row.name.trim() 
              artists.location = row.location.trim() || ""
              artists.website = row.website.trim() || ""
              artists.email = row.email.trim() || ""
              artists.facebook = row.facebook.trim() || ""
              artists.instagram = row.instagram.trim() || ""
              artists.twitter = row.twitter.trim() || ""
              artists.phone = row.phone.trim()  || ""
              artists.save().then(()=>{
              }).catch(e=>{
                  console.log(e);
                  res.status(500).send(e)
              })
          });
          res.status(200).send("prfmORartists data dumped to mongoose")
        });
    })

}