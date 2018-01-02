'use strict';

const fourEightBitSteps = 64;
const fourSixteenBitSteps = 16384;

module.exports = (waveFile) => {
  let bitsPerSample = waveFile.bitPerSample;
  if(bitsPerSample === 8){
    for (let sample of waveFile.data){
      sample = Math.round(sample / fourEightBitSteps) * fourEightBitSteps;
    }
  }
  else if(bitsPerSample === 16){
    for (let sample of waveFile.data){
      sample = Math.round(sample / fourSixteenBitSteps) * fourSixteenBitSteps;
    }
  }
};
