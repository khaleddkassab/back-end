const express = require('express');
const router = express.Router();
const { createSlot } = require("../controllers/slotController");
const verifyToken = require('../middlewares/authJWT');
const slotController = require("../controllers/slotController"); // Use a relative path

// Apply the verifyToken middleware first
router.use(verifyToken);

// Define the route to create a slot
router.post("/createSlot",createSlot, function (req, res) {
    // Your route handler logic here
});
router.get('/doctors/slots/:doctorId', slotController.viewDoctorSlots);
router.get('/doctors/allSlots', slotController.viewAllSlots);

router.get('/doctors/doctorSchedule', slotController.viewDoctorSchedule);


// Reserve a slot for a specific doctor
router.post('/reserve-slot', slotController.reserveSlot);

// Update a reservation
router.put('/update-reservation', slotController.updateReservation);

// Delete a reservation
router.delete('/delete-reservation/:slotId', slotController.deleteReservation);
router.delete('/cancelSlot/:slotId', slotController.cancelSlot);

module.exports = router;
