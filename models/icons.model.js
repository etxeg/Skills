const mongoose = require('mongoose');

const iconSchema = new mongoose.Schema({
  skillId: { type: String, required: true, unique: true }, // Asociar el icono a un skill
  svg: { type: String, required: true }, // Contenido del icono en formato SVG
});

const Icon = mongoose.model('Icon', iconSchema);

module.exports = Icon;