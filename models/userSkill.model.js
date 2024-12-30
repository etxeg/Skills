const mongoose = require('mongoose');

const UserSkillSchema = new mongoose.Schema({
    user: {
        type: String, // Storing the username as a string
        required: true
    },
    skill: {
        type: Number, // Storing the skill id as a number (e.g., skill ID as 4)
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    evidence: {
        type: String 
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifications: [
        {
            user: {
                type: String, // You can store verifier as username too, or as ObjectId
            },
            approved: {
                type: Boolean
            },
            verifiedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const UserSkill = mongoose.model('UserSkill', UserSkillSchema);

module.exports = UserSkill;
