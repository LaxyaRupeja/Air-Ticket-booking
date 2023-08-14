const jwt = require('jsonwebtoken');
const User = require('../Models/user.model');
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // console.log(token)
        if (!token) {
            res.status(404).json({ message: "Please Login First" })
            return;
        }
        var decoded = jwt.verify(token, 'shhhhh');
        // console.log(decoded.userID);
        if (!decoded.userID) {
            res.status(404).json({ message: "Wrong token" })
            return;
        }
        const exits = User.findById(decoded.userID);
        if (!exits) {
            res.status(404).json({ message: "Logged in User doesn't exits" })
            return;
        }
        req.body.userID = decoded.userID;
        next();

    } catch (error) {
        console.log("Something went wrong/Middleware", error);
        res.json({ Error: error });
    }
}
module.exports = auth;