'use strict';

const mongoose = require('mongoose');

const waveSchema = mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
  },
  wavename : {
    type : String,
  },
  url : {
    type : String,
    required : true,
  },

});

module.exports = mongoose.model('wave', waveSchema);