const mongoose = require('mongoose')
const preferencesSchema = new mongoose.Schema({
    profileID: {
        type: String,
        required: true,
        unique: true
    },
    primaryImages: {
        type: Array
    },
    profileImage: {
        type: String,
        default: "DEFAULT"
    },
    signatureSVG: {
        type: String
    },
    blocked: [String],
    blockedBy: [String],
    juryMember: {
        type: Boolean,
        default: false
    },
    allowMature: {
        type: Boolean,
        default: false
    },
    weekCalendar: {
        // profileType: {
        //     type: String
        // },
        // weekdays: {
        //     sun: { type: Boolean, default: false },
        //     mon: { type: Boolean, default: false },
        //     tue: { type: Boolean, default: false },
        //     wed: { type: Boolean, default: false },
        //     thu: { type: Boolean, default: false },
        //     fri: { type: Boolean, default: false },
        //     sat: { type: Boolean, default: false },
        // },
        // weekTime: {
        //     from: Number,
        //     to: Number
        // },
    },
    waitingConnections: [String],
    connections: [String],
    interests: [String],
    editProfileView: { //name need to be changed
        type: Object,
        required: true,
        default: {}
    },
    enableAutoNotifications: {
        type: Boolean,
        default: false
    },
    defaultTerms: [{
        profileType: {
            type: String,
        },
        termsID: String
    }],

})


module.exports = mongoose.model('preferences', preferencesSchema)