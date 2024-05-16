const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    subdistrict: {
      type: String,
    },
    district: {
      type: String,
    },
    province: {
      type: String,
    },
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
