require('dotenv').config()
const express = require('express')
const app = express();
let cors = require('cors')
const initDB = require('./mongoConfig/connection')
const axios = require('axios');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiResponse = require('./utils/response')


initDB(() => {

    if (process.env.ENV == 'production') {
        https.createServer({
            key: fs.readFileSync('/etc/letsencrypt/live/cms.theotherfruit.io/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/cms.theotherfruit.io/cert.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/cms.theotherfruit.io/chain.pem')
        }, app).listen(443, () => {
            console.log('Listening in production mode')
        })

    } else if (process.env.ENV == 'dev') {
        app.listen(5000, (err, res) => {
            console.log('server started in dev mode on port 5000');
        })
    }
})

module.exports = app