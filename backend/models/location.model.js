const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
  name : { type: String, required: true },
  description : { type: String, required: true },
  cover_pic: { type: String},
  address : {
    line_1:{ type: String, required: true},
    line_2: { type: String },
    city: { type: String, required: true },
    state_ut: { type: String, required: true },
    zipcode: { type: Number, required: true }
  },
  loc:{
    type:{ type: String},
    coordinates:[]
  },
  phone_number : { type: Number },
  location_type : { type: String },
  location_website : { type: String }
})

locationSchema.index({ loc: "2dsphere" });
locationSchema.index({ description: 'text' });
module.exports = mongoose.model('Location', locationSchema);
