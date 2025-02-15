const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const NoteSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    defualt: Date.now(),
  },
  updatedAt: {
    type: Date,
    defualt: Date.now(),
  }
});

module.exports = mongoose.model('Note', NoteSchema);
