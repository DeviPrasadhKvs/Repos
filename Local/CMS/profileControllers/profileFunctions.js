module.exports = (app) => {
    app.get('/getprofiles', (req, res) => {
        axios.get('https://ozone.theotherfuit.io/getprofiles', {})
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    })

    app.get('/getprofileinfo/:profileID', (req, res) => {
        let profileID = req.params.profileID
        axios.get('https://ozone.theotherfuit.io/getprofileinfo', {
                params: {
                    profileID
                }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    })
    app.get('/suspendAccount/:profileID', (req, res) => {
        let profileID = req.params.profileID
        axios.get('https://ozone.theotherfuit.io/suspendAccount', {
                params: {
                    profileID
                }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    })
    app.get('/revokeAccount/:profileID', (req, res) => {
        let profileID = req.params.profileID
        axios.get('https://ozone.theotherfuit.io/revokeAccount', {
                params: {
                    profileID
                }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    })
    app.get('/getUnverifiedProfiles', (req, res) => {
        // let profileID = req.params.profileID
        axios.get('https://ozone.theotherfuit.io/getUnverifiedProfiles', {
                // params: {
                //     profileID
                // }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    })
    app.get('/getIdentificationDetails/:profileID', (req, res) => {
        let profileID = req.params.profileID
        axios.get('https://ozone.theotherfuit.io/getIdentificationDetails', {
                params: {
                    profileID
                }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    })
    app.get('/approveIdentification/:profileID', (req, res) => {
        let profileID = req.params.profileID
        axios.get('https://ozone.theotherfuit.io/approveIdentification', {
                params: {
                    profileID
                }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    })
    app.get('/rejectIdentification/:profileID', (req, res) => {
        let profileID = req.params.profileID
        axios.get('https://ozone.theotherfuit.io/rejectIdentification', {
                params: {
                    profileID
                }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    })





    // app.post(('/'), (req, res) => {

    //     axios.post('/user', {
    //             firstName: '',
    //             lastName: ''
    //         })
    //         .then(function(response) {
    //             console.log(response);
    //         })
    //         .catch(function(error) {
    //             console.log(error);
    //         });
    // })
}