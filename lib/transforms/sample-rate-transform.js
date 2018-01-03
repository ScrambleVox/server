'use strict';

const SAMPLE_RATE_OFFSET = 24;

module.exports = (ConstructWaveFile, callback) => {

  let newSampleRate = ConstructWaveFile.sampleRate / 2;

  let buffer = ConstructWaveFile.buffer;

  buffer.writeInt16LE(newSampleRate, SAMPLE_RATE_OFFSET);

  callback(ConstructWaveFile);
};