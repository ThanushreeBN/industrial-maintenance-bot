const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Operational', 'Needs Attention', 'Down / Alert'],
    default: 'Operational'
  },
  temperature: {
    type: Number,
  },
  healthStatus: {
    type: String,
    enum: ['Good', 'Warning', 'Critical'],
    default: 'Good'
  },
  lastMaintenanceDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);