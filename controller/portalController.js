module.exports = (app, signUpCMS, loginCMS, md5) => {

    app.post('/signup', (req, res) => {

        if (md5(req.body.password) === md5(req.body.confirmPassword)) {
            // console.log(req.body);
            var register = new signUpCMS();
            register.userName = req.body.userName;
            register.email = req.body.email;
            register.password = md5(req.body.password);
            register.confirmPassword = md5(req.body.confirmPassword);
            register.save().then((data) => {
                res.status(200).json({
                    code: 'success',
                    data: data
                });
            }).catch(err => {
                res.status(400).json({
                    code: 'failure'
                })
            });
        } else {
            res.status(400).json({
                code: 'failure'
            })
        }
    });

    app.post('/login', function(req, res) {

        if (md5(req.body.password)) {
            console.log(req.body);
            email = req.body.email;
            password = md5(req.body.password);
            signUpCMS.findOne({ email: req.body.email }, { password: md5(req.body.password) }).countDocuments()
                .then(function(data, err) {
                    if (data >= 1) {
                        console.log(data)
                        console.log('Login success');
                    } else {
                        console.log('Login failure as the email already exists')
                    }
                }).catch(err => {
                    res.status(400).json({
                        code: 'failure'
                    })
                })
        } else {
            res.status(400).json({
                code: 'failure'
            })
        }
    });
}