const mongoose = require('mongoose');

const UserSkillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
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
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
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
