const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ListingSchema = new Schema({
    profileID : String,
    listingID : String,
    type: String,
    title: {
        type: String
    },
    description: {
        type: String
    },
    tags: String,
    price: {
        type: Number
    },
    fromDate: {
        type: Number
    },
    toDate: {
        type: Number
    },
    fromTime: {
        type: Number
    },
    toTime: {
        type: Number
    },
    additionalDetail: {
        type: String
    },
    imageArray: {
        type: Array
    }


});

module.exports = mongoose.model('sellingListing', ListingSchema);