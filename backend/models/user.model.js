const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  first_name: {type: String, required: true},
  last_name: {type: String},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isVerified: {type: Boolean, required: false},
  dob: {type: Number},
  from: {
    city: {type: String},
    state: {type: String}
  },
  gender: {type: String},
  phone_no: {type: Number},
  cover_pic: {type: String},
  profile_pic: {type: String},
  about:{type: String},
  social:{
    instagram:{type: String},
    facebook:{type: String},
    youtube:{type: String},
    twitter:{type: String}
  }
},{
  timestamps: true
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
