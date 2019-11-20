const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contractSchema = new Schema({
        termsID : String,
        profileID: String,
        size: {
            type: String
        },
        price: {
            type: String,
        },
        requestType: {
            type: String,
        },
        creativeFreedom: String,
        bookingFor: String,
        bookingPeriod: String,
        rushRequests: String,
        referenceOtherArt: String,
        visualReferences: String,
        draftReviews: String,
        finalInvoiceVariation: String,
        revisionsOfWork: String,
        chargersForEdit: String,
        billing: String,
        cancellationCharges: String,
        cancellationCharges72hr: String,
        requestReview: String,
        bodyPlacementVisuals: String,
        chargesForCustom: String,
        proposalVenueRequest: String,
        sessionCancellation: String,
        secCancellationCharges: String,
        venueReservationCost: String,
        lastMinCharges: String,
        freeText: String
    })
    const term = mongoose.model('term', contractSchema)
    module.exports = term

    