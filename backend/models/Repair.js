const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer: {
    lineId: {
      type: String,
    },
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
  },
  car: {
    numPlate: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    selectedModel: {
      type: String,
      required: true,
    },
    selectedColor: {
      type: String,
      required: true,
    }
  },
  services: [{
    serviceName: {
      type: String,
    },
    spareParts: [{
      sparePartId: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      partCost: {
        type: Number,
      },
    }],
  }],
  serviceFee: {
    type: Number,
  },
  totalCost: {
    type: Number,
  },
  mechanics: [{
    type: String,
  }],
  startdate: {
    type: String,
  },
  enddate: {
    type: String,
  },
  status: {
    state1: {
      type: Boolean,
      default: true,
    },
    state2: {
      type: Boolean,
      default: false,
    },
    state3: {
      type: Boolean,
      default: false,
    },
    state4: {
      type: Boolean,
      default: false,
    },
    state5: {
      type: Boolean,
      default: false,
    },
  },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;