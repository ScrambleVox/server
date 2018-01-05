'use strict';

const EightBitFivePercent = 256 * 0.05;
const SixteenBitFivePercent = 65535 * 0.05;

module.exports = waveFile => {
  let bitsPerSample = waveFile.bitsPerSample;
  
  if (bitsPerSample === 8) {
    
    for (let i = 0; i < waveFile.data.length; i++) {
      let howMuch = Math.ceil(Math.random() * EightBitFivePercent);
      let addOrSubtract = Math.round(Math.random());

      let sample = waveFile.data[i];
      let alteredSample = null;
      if (addOrSubtract === 0) {
        alteredSample = sample - howMuch;
        if (alteredSample < 0){
          alteredSample = 0;
        }
      } else {
        alteredSample = sample + howMuch;
        if (alteredSample > 255) {
          alteredSample = 255;
        }
      }
      waveFile.data.writeUInt8(alteredSample, i);
    }
  }
  if (bitsPerSample === 16) {
    
    for (let i = 0; i < waveFile.data.length; i += 2) {
      let howMuch = Math.ceil(Math.random() * SixteenBitFivePercent);
      let addOrSubtract = Math.round(Math.random());

      let sample = waveFile.data.readUInt16LE(i);
      let alteredSample = null;
      if (addOrSubtract === 0) {
        alteredSample = sample - howMuch;
        if (alteredSample < 0) {
          alteredSample = 0;
        }
      } else {
        alteredSample = sample + howMuch;
        if (alteredSample > 65535) {
          alteredSample = 65535;
        }
      }
      waveFile.data.writeUInt16LE(alteredSample, i);
    }
  }
  return waveFile.buffer;
};

