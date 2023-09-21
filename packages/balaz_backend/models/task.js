const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  story_id: String,
  title: String,
  points: Number,
  done: Boolean,
  created_at: Date,
  updated_at: Date,
  position_in_story: Number,
  assigned_user: String,
});

module.exports = mongoose.model('tasks', taskSchema);
