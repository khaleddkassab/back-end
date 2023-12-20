const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const verifyToken = require('../middlewares/authJWT');
const {viewMessages} = require("../controllers/messagesController"); // Assuming you have authentication middleware

// Apply the authentication middleware to protect these routes
router.use(verifyToken);

// Route to view all patient reservations
router.get('/reservations', patientController.viewPatientReservations);


module.exports = router;
