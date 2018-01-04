'use strict';

module.exports = waveFile => {
  let bitsPerSample = waveFile.bitsPerSample;
  if(bitsPerSample === 8){
    for(let i = 0; i < (waveFile.data.length) / 2; i++){
      let sample = waveFile.data[i];
      sample = waveFile.data[waveFile.data.length - i];
      waveFile.writeUInt8(sample, i);
    }
  }
  if(bitsPerSample === 16){
    for(let i = 0; i < (waveFile.data.length) / 2; i += 2){
      let sample = waveFile.data.readUInt16LE(i);
      sample = waveFile.data[waveFile.data.length - i];
      waveFile.writeUInt16LE(sample, i);
    }
  }
  return waveFile.buffer;
};
