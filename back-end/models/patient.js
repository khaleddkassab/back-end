// patient.model.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    // Patient-specific fields
    // ...

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reservedSlots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
    }],
});

module.exports = mongoose.model('Patient', patientSchema);

