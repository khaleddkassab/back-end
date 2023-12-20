const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");

exports.signup = async (req, res) => {
    try {
        const { fullName, email, role, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            fullName,
            email,
            role,
            password: hashedPassword,
        });

        // Save the user
        const savedUser = await user.save();

        // Create a profile for the user (either patient or doctor)
        if (role === "patient") {
            const patient = new Patient({ user: savedUser._id });
            await patient.save();
        } else if (role === "doctor") {
            const doctor = new Doctor({ user: savedUser._id });
            await doctor.save();
        }

        res.status(201).json({ message: "User registered successfully", user: savedUser });
    } catch (error) {
        res.status(500).json({ message: "An error occurred: " + error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "User Not Found." });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ message: "Invalid Password." });
        }

        const token = jwt.sign({ id: user.id }, process.env.API_SECRET, { expiresIn: 86400 });

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
            message: "Login successful",
            accessToken: token,
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred: " + error.message });
    }
};
