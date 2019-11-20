const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ListingSchema = new Schema({
    profileID: String,
    listingID: String,
    tags: [String],
    price: {
        type: Number
    },
    eventID: {
        type: String,
        required: true
    },
    pinThisAs: String,
    estimatedTime: {
        type: Number
    },
    additionalDetails: {
        type: String
    },
    imageArray: [String],
    views: {
        type: Number,
        default: 0,
        required: true
    },
    createdOn: {
        type: Number,
        required: true
    },
    interested: {
        type: [String]
    },
    interestedCount: {
        type: Number,
        default: 0
    }


});

module.exports = mongoose.model('listing', ListingSchema);