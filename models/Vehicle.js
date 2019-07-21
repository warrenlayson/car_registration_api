const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  plateNo: {
    type: String,
    required: true,
    unique: true
  },
  engineNo: {
    type: String,
    required: true,
    unique: true
  },
  chassisNo: {
    type: String,
    required: true,
    unique: true
  },
  dateRegistered: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('vehicle', VehicleSchema);
