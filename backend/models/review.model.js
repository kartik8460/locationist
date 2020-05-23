const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  rating: {type: Number, require: true, min: 1, max: 5},
  review: {type: String, require: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' ,required: true }
})
reviewSchema.index({ userId: 1, locationId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
