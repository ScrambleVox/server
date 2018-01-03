'use strict';

const SAMPLE_RATE_OFFSET = 24;

module.exports = constructedWaveFile => {

  let newSampleRate = constructedWaveFile.sampleRate / 2;

  constructedWaveFile.buffer.writeUInt16LE(newSampleRate, SAMPLE_RATE_OFFSET);

  return constructedWaveFile.buffer;
};