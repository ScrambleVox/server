'use strict';

const waveParser = require('./wave-parser');
const sampleRateTransform = module.exports = {};

sampleRateTransform.transformFile = (ConstructWaveFile, callback) => {

  let newSampleRate = 10000;

  let buffer = ConstructWaveFile.buffer;

  buffer.writeInt16LE(newSampleRate, waveParser.SAMPLE_RATE_OFFSET);

  callback(ConstructWaveFile);
};