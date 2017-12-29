'use strict';

const mongoose = require('mongoose');

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const httpErrors = require('http-errors');
const jsonWebToken = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  passwordSalt: {
    type: String,
    required: true,
  },
});

userSchema.methods.verifyPassword = function(password){
  return bcrypt.compare(`${password}${this.passwordSalt}`, this.passwordHash)
    .then(response => {
      if (!response){
        throw new httpErrors(401, '__AUTH__ incorrect username or password');
      }
      return this;
    });
};

userSchema.methods.createToken = function () {
  this.tokenSeed = crypto.randomBytes(64).toString('hex');

  return this.save()
    .then(user => {
      return jsonWebToken.sign({
        tokenSeed: user.tokenSeed,
      }, process.env.SECRET_SALT);
    });
};

const User = module.exports = mongoose.model('user', userSchema);

User.create = (username, email, password) => {
  const HASH_SALT_ROUNDS = 8;
  const passwordSalt = crypto.randomBytes(64).toString('hex');
  return bcrypt.hash(`${password}${passwordSalt}`, HASH_SALT_ROUNDS)
    .then(passwordHash => {
      const tokenSeed = crypto.randomBytes(64).toString('hex');
      return new User({
        username,
        email,
        passwordHash,
        tokenSeed,
        passwordSalt,
      }).save();
    });
};