'use strict';

const eightEightBitSteps = 32;
const eightSixteenBitSteps = 8192;

module.exports = waveFile => {
  let bitsPerSample = waveFile.bitsPerSample;
  if(bitsPerSample === 8){
    for (let i = 0; i < waveFile.data.length; i++){
      let sample = waveFile.data[i];
      let alteredSample = Math.floor(sample / eightEightBitSteps) * eightEightBitSteps;
      waveFile.data.writeUInt8(alteredSample, i);
    }
  }
  if(bitsPerSample === 16){
    for (let i = 0; i < waveFile.data.length; i += 2) {
      let sample = waveFile.data.readUInt16LE(i);
      let alteredSample = Math.floor(sample / eightSixteenBitSteps) * eightSixteenBitSteps;
      waveFile.data.writeUInt16LE(alteredSample, i);
    }
  }
  return waveFile.buffer;
};
