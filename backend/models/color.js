const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  colorname: {
    type: String,
    required: true,
    unique: true
  },
});

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;