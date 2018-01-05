'use strict';

const SAMPLE_RATE_OFFSET = 24;

module.exports = waveFile => {

  let newSampleRate = waveFile.sampleRate / 2;

  waveFile.buffer.writeUInt16LE(newSampleRate, SAMPLE_RATE_OFFSET);

  return waveFile.buffer;
};