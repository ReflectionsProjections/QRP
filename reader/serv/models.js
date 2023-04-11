const mongoose = require("mongoose");

const ScanEvent = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    isStaff: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    }
})

const Scan = mongoose.model("ScanEvent", ScanEvent);

module.exports = { Scan };