const Slot = require('../models/slot');
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const Message = require("../models/message");
// Create a new slot
exports.createSlot = async (req, res) => {


    try {
        // Assuming you have a property 'role' in your user model to distinguish doctors
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Permission denied. User is not a doctor.' });
        }
        const doctorId = req.user._id;
        const { startTime, endTime } = req.body;

        // Create a new slot associated with the doctor
        const slot = new Slot({
            doctor: doctorId,
            startTime,
            endTime,
        });
        await slot.save();

        res.status(200).json({ message: 'Slot created successfully', slot });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred: ' + error.message });
    }
};
exports.viewDoctorSlots = async (req, res) => {
    try {
        const {doctorId} = req.params;

        // Find the doctor by ID
        const doctor = await Doctor.findOne({ user: doctorId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Find all available slots for the doctor
        const slots = await Slot.find({ doctor: doctorId, reservedBy: null });

        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred: ' + error.message });
    }
};
exports.viewAllSlots = async (req, res) => {
    try {

        const  userId = req.user._id.toString();
        // Check if the user is a doctor
        if (!userId) {
            return res.status(403).json({ message: 'Unauthorized. Only Authorized can perform this operation.' });
        }

        // Find all available slots where reservedBy is null
        const slots = await Slot.find({ reservedBy: null });

        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred: ' + error.message });
    }
};

exports.viewDoctorSchedule = async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Permission denied. User is not a doctor.' });
        }
        const doctorId = req.user._id;


        // Find the doctor by ID
        const doctor = await Doctor.findOne({ user: doctorId });


        // Find all available slots for the doctor
        const slots = await Slot.find({ doctor: doctorId });

        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred: ' + error.message });
    }
};


exports.reserveSlot = async (req, res) => {
    try {
        if (req.user.role !== 'patient') {
            return res.status(403).json({ message: 'Permission denied. User is not a Patient.' });
        }

        const { slotId } = req.body;
        const patientId = req.user._id; // Assuming patient is authenticated

        // Find the slot by ID
        const slot = await Slot.findById(slotId);

        // Find the doctor ID from the slot
        const doctorId = slot.doctor;

        // Find the doctor by ID
        const doctor = await Doctor.findOne({ user: doctorId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.reservedBy) {
            return res.status(400).json({ message: 'Slot is already reserved' });
        }

        // Update the slot to be reserved by the patient
        slot.reservedBy = patientId;
        await slot.save();

        // Update the patient's profile to include the reserved slot
        const patient = await Patient.findOne({ user: patientId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.reservedSlots.push(slotId);
        await patient.save();

        // Create a message and add it to the doctor's messages array
        const message = new Message({
            doctorId: doctorId,
            patientId: patientId,
            slotId: slotId,
            message: 'Reserved', // You can customize the message content
        });

        await message.save();

        // Add the message to the doctor's messages array
        doctor.messages.push(message);
        await doctor.save();

        res.status(200).json({ message: 'Slot reserved successfully', slot });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred: ' + error.message });
    }
};



exports.updateReservation = async (req, res) => {
    try {
        const { currentSlotId, newSlotId } = req.body;
        const patientId = req.user._id; // Assuming the patient is authenticated

        const currentSlot = await Slot.findById(currentSlotId);
        if (!currentSlot) {
            return res.status(404).json({ message: 'Current slot not found' });
        }

        if (currentSlot.reservedBy.toString() !== patientId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this reservation' });
        }

        const newSlot = await Slot.findById(newSlotId);
        if (!newSlot) {
            return res.status(404).json({ message: 'New slot not found' });
        }

        if (newSlot.reservedBy) {
            return res.status(400).json({ message: 'New slot is already reserved' });
        }

        // Cancel the current reservation
        currentSlot.reservedBy = null;
        await currentSlot.save();

        // Reserve the new slot
        newSlot.reservedBy = patientId;
        await newSlot.save();

        const patient = await Patient.findOne({ user: patientId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Update patient's reserved slots
        patient.reservedSlots = patient.reservedSlots.filter((reservation) => reservation !== currentSlotId);
        patient.reservedSlots.push(newSlotId);
        await patient.save();

        // Create a message and add it to the doctors' messages array
        const message = new Message({
            doctorId: currentSlot.doctor, // Assuming the current slot's doctor
            patientId: patientId,
            slotId: newSlotId,
            message: 'Updated Reservation', // You can customize the message content
        });

        await message.save();

        // Add the message to the current and new slot's doctors' messages array
        const currentDoctor = await Doctor.findOne({ user: currentSlot.doctor });
        const newDoctor = await Doctor.findOne({ user: newSlot.doctor });

        if (currentDoctor && newDoctor) {
            currentDoctor.messages.push(message);
            newDoctor.messages.push(message);
            await currentDoctor.save();
            await newDoctor.save();
        }

        res.status(200).json({ message: 'Reservation updated successfully', newSlot });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the reservation: ' + error.message });
    }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
    try {
        const { slotId } = req.params;
        const userId = req.user._id.toString(); // Assuming the patient is authenticated
        const slot = await Slot.findById(slotId);
        const doctorId = slot.doctor; // Assuming the patient is authenticated


        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.reservedBy.toString() !== userId && slot.doctor._id.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this reservation' });
        }

        const patientId = slot.reservedBy;
        if (!patientId) {
            return res.status(200).json({ message: 'Reservation deleted successfully', slot });
        }

        slot.reservedBy = null;
        await slot.save();

        const patient = await Patient.findOne({ user: patientId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        if (!patient.reservedSlots.includes(slotId)) {
            return res.status(400).json({ message: 'This reservation is not associated with the patient' });
        }

        patient.reservedSlots = patient.reservedSlots.filter((reservation) => reservation !== slotId);
        await patient.save();

        // Create a message and add it to the doctor's messages array
        const message = new Message({
            doctorId: doctorId,
            patientId: patientId,
            slotId: slotId,
            message: `Cancelled`,
        });

        await message.save();

        // Add the message to the doctor's messages array
        const doctor = await Doctor.findOne({ user:doctorId  });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        doctor.messages.push(message);
        await doctor.save();

        res.status(200).json({ message: 'Reservation deleted successfully', slot });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the reservation: ' + error.message });
    }
};
exports.cancelSlot = async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(404).json({ message: 'Unauthorized' });
        }

        const { slotId } = req.params;
        const doctorId = req.user._id.toString(); // Assuming the doctor is authenticated

        const slot = await Slot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.doctor.toString() !== doctorId) {
            return res.status(403).json({ message: 'You are not authorized to delete this slot' });
        }

        if (!slot.reservedBy) {
            // If the slot is not reserved, delete it directly
            await slot.deleteOne();
            return res.status(200).json({ message: 'Slot deleted successfully' });
        }

        const patientId = slot.reservedBy.toString();
        const patient = await Patient.findOne({ user: patientId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Remove the slot from the patient's reservedSlots
        patient.reservedSlots = patient.reservedSlots.filter((reservation) => reservation !== slotId);
        await patient.save();

        // Delete the slot from the database
        await Slot.deleteOne();

        res.status(200).json({ message: 'Slot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the slot: ' + error.message });
    }
};
