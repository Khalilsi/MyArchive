const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],  // Restrict to these values
        default: 'user',          // New users are regular users by default
    },
    isApproved: {
        type: Boolean,
        default: false,           // Users start unapproved until admin approves
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User; 