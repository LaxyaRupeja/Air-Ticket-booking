const mongoose = require('mongoose');
const bookingSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'flight' }

}, {
    versionKey: false
})
const Booking = mongoose.model("booking", bookingSchema)
module.exports = Booking;