const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true, 
        unique: true
    },
    text: {
        type: String,
        required: true
    },
    icon: {
        type: String 
    },
    set: {
        type: String,
        required: true 
    },
    tasks: {
        type: [String], // Lista de tareas
        default: []
    },
    resources: {
        type: [String], 
        default: []
    },
    description: {
        type: String
    },
    score: {
        type: Number,
        default: 1
    }
});

const Skill = mongoose.model('Skill', SkillSchema);

module.exports = Skill;
