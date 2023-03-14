const mongoose = require('mongoose');
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

const User = mongoose.model('User', userSchema);

module.exports = User;
