const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
