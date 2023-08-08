const express = require("express");
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const newUser = new User(req.body);

        // Check if the username is already taken
        const existingByUsername = await User.findOne({ username: newUser.username });
        if (existingByUsername) {
            return res.status(400).json({
                statusCode: 400,
                successMessage: null,
                errorMessage: "Username already taken",
                data: null
            });
        }

        // Check if the email is already taken
        const existingByEmail = await User.findOne({ email: newUser.email });
        if (existingByEmail) {
            return res.status(400).json({
                statusCode: 400,
                successMessage: null,
                errorMessage: "Email already taken",
                data: null
            });
        }
            // Hash the password before saving
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
            newUser.password = hashedPassword;

        // Save the new user to the database
        await newUser.save();

        return res.status(201).json({
            statusCode: 201,
            successMessage: "User created successfully",
            errorMessage: null,
            data: null
        });
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error occurred during user registration:", error);
        return res.status(500).json({
            statusCode: 500,
            successMessage: null,
            errorMessage: "An unexpected error occurred",
            data: null
        });
    }
});


router.post("/login", async (req, res) => {
    const loginInfo = req.body;
    const user = await User.findOne({ username: loginInfo.username });

    if (user) {
        // Compare the hashed password in the database with the input password
        const isPasswordValid = await bcrypt.compare(loginInfo.password, user.password);

        if (isPasswordValid) {
            // Passwords match, so login is successful
            const userData = {
                _id: user._id,
                username: user.username,
                // Add any other user data you want to include here, excluding the password
            };
            res.json({
                statusCode: 200,
                successMessage: "Login success",
                errorMessage: null,
                data: userData
            });
        } else {
            // Incorrect password
            res.json({
                statusCode: 401,
                successMessage: null,
                errorMessage: "Incorrect username or password",
                data: null
            });
        }
    } else {
        // User not found
        res.json({
            statusCode: 401,
            successMessage: null,
            errorMessage: "Incorrect username or password",
            data: null
        });
    }
});
module.exports = router