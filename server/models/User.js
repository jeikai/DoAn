const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String },
  DOB: { type: Date },
  address: {type: String},
  // Khoa
  Department: {type: String},
  //Ngành
  Majors: {type: String},
  role: { type: Number, enum: [0, 1, 2], default: 0},
  date_created: Date
});

const User = mongoose.model('User', UserSchema, 'users');
module.exports = User;