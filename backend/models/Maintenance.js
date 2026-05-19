const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  equipmentName: {
    type: String,
    required: true,
  },
  maintenanceType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  technicianName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Completed'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);