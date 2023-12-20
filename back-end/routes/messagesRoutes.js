const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authJWT');
const {viewMessages} = require("../controllers/messagesController"); // Assuming you have authentication middleware
const messagesController = require('../controllers/messagesController');

// Apply the authentication middleware to protect these routes
router.use(verifyToken);

// Route to view all patient reservations
router.get('/messages',messagesController.viewMessages );


module.exports = router;
