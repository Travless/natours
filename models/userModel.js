/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name.'],
    maxLength: [
      40,
      "a user's name must be less than or equal to 40 characters",
    ],
    minLength: [10, "A user's name must have at least 10 or more characters."],
  },
  email: {
    type: String,
    required: [true, 'A user must provide an email address.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must provide a password.'],
    minLength: [
      10,
      "A user's password must be at least 10 or more characters.",
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'You must confirm your provided password.'],
    validate: {
      // Use standard function format, not arrow function, so you have access to this keyword
      // This validator only works on CREAT and SAVE!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

// Encryption middleware
// Happens between receiving the data and when it presisted to the database (prehook)
userSchema.pre('save', async function (next) {
  // Only run ths function if password if password was actually modified
  if (!this.isModified('password')) return next();

  // bycrypt creates hash based on cost parma that is passed into hash function and generates salt based on it
  this.password = await bcrypt.hash(this.password, 12);

  // Delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
