'use strict';

const fourEightBitSteps = 64;
const fourSixteenBitSteps = 16384;

module.exports = (waveFile) => {
  let bitsPerSample = waveFile.bitsPerSample;
  if(bitsPerSample === 8){
    for (let i = 0; i < waveFile.data.length; i++){
      let sample = waveFile.data[i];
      let alteredSample = Math.floor(sample / fourEightBitSteps) * fourEightBitSteps;
      waveFile.data.writeUInt8(alteredSample, i);
    }
  }
  else if(bitsPerSample === 16){
    for (let i = 0; i < waveFile.data.length; i += 2) {
      let sample = waveFile.data.readUInt16LE(i);
      let alteredSample = Math.floor(sample / fourSixteenBitSteps) * fourSixteenBitSteps;
      waveFile.data.writeUInt16LE(alteredSample, i);
    }
  }
  return waveFile.buffer;
};
