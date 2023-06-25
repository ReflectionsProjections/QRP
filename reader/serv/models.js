const mongoose = require("mongoose");

const ScanEvent = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    date: {
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