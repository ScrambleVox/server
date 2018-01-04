'use strict';

module.exports = (waveFile) => {
  let bitsPerSample = waveFile.bitsPerSample;
  if(bitsPerSample === 8){
    for(let i = 0; i < (waveFile.data.length) / 2; i++){
      let beginningSample = waveFile.data[i];
      // console.log(beginningSample, `beginning`);
      let endSample = waveFile.data[waveFile.data.length - (i + 1)];
      // console.log(endSample, `end`);
      waveFile.data.writeUInt8(endSample, i);
      waveFile.data.writeUInt8(beginningSample, waveFile.data.length - (i + 1));
    }
  }
  // if(bitsPerSample === 16){
  //   for(let i = 0; i < (waveFile.data.length) / 2; i += 2){
  //     let sample = waveFile.data.readUInt16LE(i);
  //     console.log(sample, `16 bit`);
  //     sample = waveFile.data[waveFile.data.length - i];
  //     waveFile.data.writeUInt16LE(sample, i);
  //   }
  // }
  return waveFile.buffer;
};
