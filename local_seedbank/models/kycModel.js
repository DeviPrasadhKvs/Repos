const mongoose = require('mongoose')
const kycSchema = new mongoose.Schema({
    profileID: {
        type: String,
        required: true
    },
    imageID: {
        type: String,
        default: "",
    },
    imageStatus: {
        type: String, // PENDING, REJECTED, APPROVED
        default: "PENDING"
    },
    verification: {
        type: Boolean,
        default: false,
        require: true

    },
    imageUpload: {
        type: String,
        required: true,
        default: false
    },
    rejectReason: {
        type: String,
        default: ""
    }
})
module.exports = mongoose.model('KYCDetails', kycSchema)