const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    deleted: {type: Boolean, default: false},
    usertype: {type: String, required: true}
});

let User = mongoose.model("User", userSchema); // users

module.exports = User;
