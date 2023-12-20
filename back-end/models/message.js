var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var messageSchema = new Schema({
    doctorId: {
        type: String,
        required: true
    },
    patientId: {
        type: String,
        required: true
    },
    slotId: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String, // make it optional
        // required: true // remove this line
    },
});

module.exports = mongoose.model('Message', messageSchema);
