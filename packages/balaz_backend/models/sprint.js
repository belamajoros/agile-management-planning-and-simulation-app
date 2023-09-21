const mongoose = require('mongoose');

const { Schema } = mongoose;

const sprintSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: String,
  project_id: String,
  title: String,
  status: String,
  startDate: Date,
  endDate: Date,
  created_at: Date,
  updated_at: Date,
  changed: Date,
});

module.exports = mongoose.model('sprints', sprintSchema);
