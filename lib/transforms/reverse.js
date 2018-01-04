'use strict';

module.exports = (waveFile) => {
  let bitsPerSample = waveFile.bitsPerSample;
  if(bitsPerSample === 8){
    for(let i = 0; i < (waveFile.data.length) / 2; i++){
      let beginningSample = waveFile.data[i];
      let endSample = waveFile.data[waveFile.data.length - (i + 1)];
      waveFile.data.writeUInt8(endSample, i);
      waveFile.data.writeUInt8(beginningSample, waveFile.data.length - (i + 1));
    }
  }
  if(bitsPerSample === 16){
    for(let i = 0; i < (waveFile.data.length) / 2; i += 2){
      let beginningSample = waveFile.data.readUInt16LE(i);
      let endSample = waveFile.data.readUInt16LE(waveFile.data.length - (i + 2));
      // console.log(waveFile.data);
      // console.log(endSample, `endSample`);
      waveFile.data.writeUInt16LE(endSample, i);
      waveFile.data.writeUInt16LE(beginningSample, waveFile.data.length - (i + 2));
    }
  }
  return waveFile.buffer;
};
