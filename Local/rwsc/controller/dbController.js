// const readXlsxFile = require('read-excel-file/node');
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "188.166.230.232",
    user: "charles",
    password: "Seaharrier@1",
    database: "RWSC"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = (app, rwscDb, rwscUsersDb, apiResponse) => {

    app.get('/rwscDbData', function(req, res) {
        con.query("SELECT * FROM rwsc", function(err, result) {
            if (err) throw err;
            console.log(result[0]);
            result.forEach(row => {
                rwscData = new rwscDb()
                rwscData.id = row.id
                rwscData.code = row.code
                rwscData.address = row.address
                rwscData.timestamp = row.timestamp
                rwscData.txid = row.txid
                rwscData.cValue = row.cValue
                rwscData.save().then(() => {
                    console.log('saved');
                }).catch(e => {
                    console.log(e);
                    res.status(500).send(e)
                })
            });
            return res.status(200).send("RWSC data dumped to Mongoose")
        });
    })

    app.get('/rwscUsersDbData', (req, res) => {
        con.query("SELECT * FROM users", function(err, result) {
            if (err) throw err;
            console.log(result[0]);
            result.forEach(row => {
                rwscUsers = new rwscUsersDb()
                rwscUsers.id = row.id
                rwscUsers.username = row.username
                rwscUsers.password = row.password
                rwscUsers.save().then(() => {
                    console.log('saved');
                }).catch(e => {
                    console.log(e);
                    res.status(500).send(e)
                })
            })
            return res.status(200).send("RWSC User data dumped to Mongoose")
        });
    })

    app.get('/rwscData', (req, res) => {
        rwscDb.find().then((data, error) => {
            if (data != null) {
                console.log(data);
                return res.status(200).send(apiResponse.sendReply(1, 'Successful', data))
            } else {
                return res.status(500).send(apiResponse.reportError(error))
            }
        }).catch((err) => {
            console.log(err);
            return res.status(500).send(apiResponse.reportError(err))
        });
    });
}