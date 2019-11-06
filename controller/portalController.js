module.exports = (app, apiResponse, adminSignUpCMS, userSignUpCMS, md5) => {

    app.post('/signup', (req, res) => {

        if (md5(req.body.password) === md5(req.body.confirmPassword)) {
            // console.log(req.body);
            var adminRegister = new adminSignUpCMS();
            adminRegister.userName = req.body.userName;
            adminRegister.email = req.body.email;
            adminRegister.password = md5(req.body.password);
            adminRegister.confirmPassword = md5(req.body.confirmPassword);
            adminRegister.save().then((data) => {
                return res.status(200).send(apiResponse.sendReply(1, 'Registered', data))
            }).catch(err => {
                return res.status(500).send(apiResponse.reportError(err));
            });
        } else {
            return res.status(500).send(apiResponse.reportError(err));
        }
    });

    app.post('/login', function(req, res) {

        if (md5(req.body.password)) {
            console.log(req.body);
            email = req.body.email;
            password = md5(req.body.password);
            adminSignUpCMS.findOne({ email: req.body.email }, { password: md5(req.body.password) }).countDocuments()
                .then(function(data, err) {
                    if (data >= 1) {
                        console.log(data)
                        console.log('Login success');
                        return res.status(200).send(apiResponse.sendReply(1, 'Login Success', data))
                    } else {
                        console.log('Login failure as the email already exists')
                        return res.status(500).send(apiResponse.reportError(err));

                    }
                }).catch(err => {
                    return res.status(500).send(apiResponse.reportError(err));
                })
        } else {
            return res.status(500).send(apiResponse.reportError(err));
        }
    });

    app.post('/createuser', function(req, res) {

        if (md5(req.body.password) === md5(req.body.confirmPassword)) {

            console.log(req.body);
            var userRegister = new userSignUpCMS();
            userRegister.userName = req.body.userName;
            userRegister.email = req.body.email;
            userRegister.userType = req.body.userType;
            userRegister.password = md5(req.body.password);
            userRegister.confirmPassword = md5(req.body.confirmPassword)
            userRegister.save().then((data) => {
                return res.status(200).send(apiResponse.sendReply(1, 'Created', data))
            }).catch(err => {
                return res.status(500).send(apiResponse.reportError(err));
            })
        } else {
            return res.status(500).send(apiResponse.reportError(err));
        }
    });
}