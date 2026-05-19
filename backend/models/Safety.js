const mongoose = require('mongoose');

const safetySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  guidelines: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Safety', safetySchema);