const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null, // Initially unreserved
    },
});

module.exports = mongoose.model('Slot', slotSchema);
