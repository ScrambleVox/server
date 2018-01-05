'use strict';

module.exports = (waveFile, delayTime = 0.2) => {
  const eightBitZero = 127;
  const sixteenBitLargest = 32767;

  const bitsPerSample = waveFile.bitsPerSample;
  const sampleRate = waveFile.sampleRate;
  let delaySamples = Math.round(sampleRate * delayTime);

  if (bitsPerSample === 8) {
    for (let i = delaySamples; i < waveFile.data.length; i++) {
      let alteredSample = Math.floor(0.25 * (waveFile.data[i - delaySamples] - eightBitZero)) + Math.floor(0.75 * (waveFile.data[i] - eightBitZero)) + eightBitZero;
      if (alteredSample > 255){
        alteredSample = 255;
      }
      if (alteredSample < 0){
        alteredSample = 0;
      }
      waveFile.data.writeUInt8(alteredSample, i);
    }
  }

  if (bitsPerSample === 16){
    if (delaySamples % 2 !== 0){
      delaySamples += 1;
    }
    for (let i = delaySamples; i < waveFile.data.length; i += 2) {
      let pastSample = waveFile.data.readInt16LE(i - delaySamples);
      let currentSample = waveFile.data.readInt16LE(i);
      let alteredSample = Math.floor(0.25 * (pastSample)) + Math.floor(0.75 * (currentSample));
      if (alteredSample > sixteenBitLargest) {
        alteredSample = sixteenBitLargest;
      }
      if (alteredSample < -sixteenBitLargest) {
        alteredSample = -sixteenBitLargest;
      }
      waveFile.data.writeInt16LE(alteredSample, i);
    }
  }
  return waveFile.buffer;
};
