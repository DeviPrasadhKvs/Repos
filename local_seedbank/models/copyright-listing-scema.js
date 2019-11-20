const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CopyrightListingSchema = new Schema({
    profileID : String,
    copyrightTitle: {
        type: String
    },
    copyrightDescription: {
        type: String
    },
    copyrightImage: {
        type: Array
    }


});
 
module.exports = mongoose.model('copyrightListing', CopyrightListingSchema);