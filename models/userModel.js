/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
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

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // set passwordChangedAt to one sec before so that the token is always generated after the password has been changed in case adding to DB is slowed
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// check if provided password is the same as encrypted password via instance method
// instance method is available on all user documents
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // Use crypto util to encrypt passwordResetToken
  // crypto.randomBytes(desired length of token).toString('hex', convert encrypted string to hexagonal string)
  const resetToken = crypto.randomBytes(32).toString('hex');

  // use crypto util to set password reset token to user schema
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // this sets the passworrd reset token to expire in 10 minutes (formatted in miliseconds) from whan it's requested
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Plain text token that will be sent via email
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
