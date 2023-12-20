const Patient = require('../models/patient');
const Slot = require('../models/slot');

// View all reservations for a specific patient
exports.viewPatientReservations = async (req, res) => {
    try {
        const patientId = req.user._id; // Assuming the patient is authenticated

        // Find the patient by ID
        const patient = await Patient.findOne({ user: patientId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Find all reservations for the patient
        const reservations = await Slot.find({ reservedBy: patientId });

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred: ' + error.message });
    }
};
