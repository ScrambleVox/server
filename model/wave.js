'use strict';

const mongoose = require('mongoose');

const waveSchema = mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
  },
  filename : {
    type : String,
    required : true,
  },
  url : {
    type : String,
    required : true,
  },

});

module.exports = mongoose.model('wave', waveSchema);