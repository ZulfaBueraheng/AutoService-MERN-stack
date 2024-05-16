const mongoose = require('mongoose');

const brandmodelSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
    unique: true
  },
  brand: {
    type: String,
    required: true,
  },
});

const BrandModel = mongoose.model('BrandModel', brandmodelSchema);

module.exports = BrandModel;