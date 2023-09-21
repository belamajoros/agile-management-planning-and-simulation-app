const mongoose = require('mongoose');

const { Schema } = mongoose;

const storySchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: String,
  sprint_title: String,
  sprint_id: String,
  project_id: String,
  title: String,
  description: String,
  progress: Number,
  created_at: Date,
  updated_at: Date,
  changed: Date,
});

module.exports = mongoose.model('stories', storySchema);
