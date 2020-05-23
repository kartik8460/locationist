const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' ,required: true },
  imagesPaths: [String],
  videosPaths: [String],
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true }
});

module.exports = mongoose.model('Post', postSchema);
