const mongoose = require('mongoose');

const { Schema } = mongoose;

const projectSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // slug: String,
  user_id: String,
  title: String,
  members: Array,
  description: String,
  created_at: Date,
  updated_at: Date,
});

module.exports = mongoose.model('projects', projectSchema);
