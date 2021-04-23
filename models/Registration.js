const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const registrationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  id: {
    type: String,
    trim: true,
  },
  dob: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
});
registrationSchema.plugin(passportLocalMongoose); //also auto salt and hash password
module.exports = mongoose.model('Registration', registrationSchema);