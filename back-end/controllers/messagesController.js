
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const Messages = require("../models/message");


// View all messages for a specific doctor
exports.viewMessages = async (req, res) => {
    try {
        // Check if the user is authenticated and has the role of a doctor
        if (!req.user || req.user.role !== 'doctor') {
            return res.status(401).json({ message: 'Unauthorized: Only doctors can access this resource' });
        }

        const doctorId = req.user._id.toString(); // Assuming the user is authenticated as a doctor


        // Find the doctor by ID and populate the 'messages' field
        const messages = await Messages.find({ doctorId: doctorId });


        res.status(200).json(messages);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred: ' + error.message });
    }
};
