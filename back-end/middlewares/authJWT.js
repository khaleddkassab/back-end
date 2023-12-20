const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("JWT ")) {
        req.user = undefined;
        return next();
    }

    const tokenValue = token.split(" ")[1];

    try {
        const decode = jwt.verify(tokenValue, process.env.API_SECRET);

        const user = await User.findOne({ _id: decode.id });
        if (!user) {
            console.error("User not found");
            req.user = undefined;
            return next();
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification or User Retrieval Error:", error);
        req.user = undefined;
        return next();
    }
};

module.exports = verifyToken;
