const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    rango: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    bitpoints_min: {
        type: Number,
        required: true
    },
    bitpoints_max: {
        type: Number
    },
    png: {
        type: String
    }
});

const Badge = mongoose.model('Badge', BadgeSchema);

module.exports = Badge;
