const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/user.model');
const Flight = require('../Models/flight.model');
const Booking = require('../Models/booking.model');
const auth = require('../Middlewares/auth.middleware');
const router = express.Router();
router.get("/", (req, res) => {
    res.send("Welcome to Air Flight Booking Backend (By Laxya Rupeja)")
})
router.post("/register", async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exits = await User.findOne({ email });
        if (exits) {
            res.status(404).json({ message: "User already exits with the same email" })
            return;
        }
        const hash = bcrypt.hashSync(password, 3);
        const newUser = User({ name, password: hash, email });
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch (err) {
        console.log("Something wend wrong", err)
        res.json({ Error: err })
    }
})
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const exits = await User.findOne({ email });
        if (!exits) {
            res.status(404).json({ message: "Email doesn't Exists" })
            return;
        }
        const match = bcrypt.compareSync(password, exits.password);
        if (match) {
            var token = jwt.sign({ userID: exits._id }, 'shhhhh', { expiresIn: "7d" });
            res.status(201).json({ message: "Login Successful", token })
        }
        else {
            res.status(404).json({ message: "Login failed/Wrong Password" });
        }
    } catch (error) {
        console.log("Something went wrong", error);
        res.status(404).json({ Error: error });
    }
})
router.get("/flights", auth, async (req, res) => {
    try {
        const flights = await Flight.find();
        res.json({ flights });
    } catch (error) {
        console.log("Something went wrong", error);
        res.status(404).json({ Error: error });
    }

})
router.get("/flights/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        const flights = await Flight.findById(id);
        res.json({ flights });

    } catch (error) {
        console.log("Something went wrong", error);
        res.status(404).json({ Error: error });
    }
})
router.post("/flights", auth, async (req, res) => {
    const { airline, flightNo, departure, arrival, departureTime, arrivalTime, seats, price } = req.body;
    try {
        const newFlight = Flight({ airline, flightNo, departure, arrival, departureTime, arrivalTime, seats, price });
        await newFlight.save();
        res.status(201).json({ newFlight });
    } catch (error) {
        console.log("Something went wrong", error);
        res.json({ Error: error });
    }

})
router.patch("/flights/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        const UpdatedFlight = await Flight.findByIdAndUpdate(id, req.body, {
            new: true
        });
        if (!UpdatedFlight) {
            res.status(404).json({ message: "Invalid ID" })
            return;
        }
        res.status(204).json({ message: "Updated Successfully", UpdatedFlight });
    } catch (error) {
        console.log("Something went wrong", error);
        res.json({ Error: error });
    }
})
router.delete("/flights/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        const DeletedFlight = await Flight.findByIdAndDelete(id);
        if (!DeletedFlight) {
            res.status(404).json({ message: "Invalid ID" })
            return;
        }
        res.status(202).json({ message: "Deleted Successfully", DeletedFlight });
    } catch (error) {
        console.log("Something went wrong", error);
        res.json({ Error: error });
    }
})
router.post("/booking", auth, async (req, res) => {
    const { id, userID } = req.body;
    // const {  } = req.userData;
    try {
        const exits = Flight.findById(id);
        if (!exits) {
            res.status(404).json({ message: "Flight with this ID doesnt exits" })
        }
        const newBooking = Booking({ user: userID, flight: id });
        await newBooking.save();
        const UserBooking = await Booking.findById(newBooking._id).populate("user").populate("flight");
        res.status(201).json({ message: "Flight has been booked", UserBooking });
    } catch (error) {
        console.log("Something went wrong", error);
        res.json({ Error: error });
    }

})
router.get("/dashboard", auth, async (req, res) => {

    try {
        const Bookings = await Booking.find().populate("user").populate("flight");
        res.json({ Bookings })
    } catch (error) {
        console.log("Something went wrong", error);
        res.json({ Error: error });
    }

})
router.patch("/dashboard/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        const UpdatedBooking = await Booking.findByIdAndUpdate(id, req.body);
        if (!UpdatedBooking) {
            res.status(404).json({ message: "Invalid ID" })
            return;
        }
        res.status(204).json({ message: "Updated Successfully", UpdatedBooking });
    } catch (error) {
        console.log("Something went wrong", error);
        res.json({ Error: error });
    }
})
router.delete("/dashboard/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        const DeletedBooking = await Booking.findByIdAndUpdate(id);
        if (!DeletedBooking) {
            res.status(404).json({ message: "Invalid ID" })
            return;
        }
        res.status(202).json({ message: "Deleted Successfully", DeletedBooking });
    } catch (error) {
        console.log("Something went wrong", error);
        res.json({ Error: error });
    }
})



module.exports = router