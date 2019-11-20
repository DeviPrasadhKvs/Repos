module.exports = (app, rwscDb, apiResponse) => {

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