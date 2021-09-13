const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is a required field'],
    },
    email: {
      type: String,
      required: [true, 'Email is a required field'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Enter a valid email address'],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Password is a required field'],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Password Confirmation is a required field'],
      validate: {
        //only works on .create() and .save()
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
  },
  { timestamps: true }
);

//---------------------------------------------------------------------

userSchema.pre('save', async function (next) {
  //only run if password is modified
  if (!this.isModified('password')) return next();

  //hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete password confirm field
  this.passwordConfirm = undefined;

  next();
});

//---------------------------------------------------------------------

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const UsersModel = mongoose.model('UsersModel', userSchema);

module.exports = UsersModel;
