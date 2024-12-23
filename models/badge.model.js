const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
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
    image_url: {
        type: String
    }
});

const Badge = mongoose.model('Badge', BadgeSchema);

module.exports = Badge;
