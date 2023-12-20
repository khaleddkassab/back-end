// doctor.model.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    // Doctor-specific fields
    // ...

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdSlots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
});

module.exports = mongoose.model('Doctor', doctorSchema);
