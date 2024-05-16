const mongoose = require('mongoose');

const spareSchema = new mongoose.Schema({
  spareName: {
    type: String,
    required: true,
    unique: true
  },
  spareType: {
    type: String,
  },
  sparePrice: {
    type: Number,
    required: true,
  },
});

const Spare = mongoose.model('Spare', spareSchema);

module.exports = Spare;
