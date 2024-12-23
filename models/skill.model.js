const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    set: {
        type: String,
        required: true // Por ejemplo, 'electronics' o 'llm101'
    },
    description: {
        type: String
    },
    tasks: {
        type: [String], // Lista de tareas
        default: []
    },
    resources: {
        type: [String], // Lista de URLs para recursos
        default: []
    },
    score: {
        type: Number,
        default: 1
    },
    icon: {
        type: String // URL del icono
    }
});

const Skill = mongoose.model('Skill', SkillSchema);

module.exports = Skill;
