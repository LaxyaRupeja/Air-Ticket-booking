const mongoose = require('mongoose');
require('dotenv').config();
const connectionToAtlas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_URL);
        console.log("Server started on PORT 8080")
    }
    catch (err) {
        console.log("Error while connecting with MongoDB", err)
    }
}
module.exports = { connectionToAtlas };