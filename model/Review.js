const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: 0
    },
    organisation: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Review', ReviewSchema);