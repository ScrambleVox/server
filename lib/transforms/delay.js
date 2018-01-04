'use strict';

module.exports = (waveFile, delayTime = 0.1) => {
  const eightBitZero = 127;
  const sixteenBitZero = 32767;

  const bitsPerSample = waveFile.bitsPerSample;
  const sampleRate = waveFile.sampleRate;
  let delaySamples = Math.round(sampleRate * delayTime);

  if (bitsPerSample === 8) {
    for (let i = delaySamples; i < waveFile.data.length; i++) {
      let alteredSample = Math.floor(0.25 * (waveFile.data[i - delaySamples] - eightBitZero)) + Math.floor(0.75 * (waveFile.data[i] - eightBitZero)) + eightBitZero;
      waveFile.data.writeUInt8(alteredSample, i);
    }
  }

  if (bitsPerSample === 16){
    if (delaySamples % 2 !== 0){
      delaySamples += 1;
    }
    for (let i = delaySamples; i < waveFile.data.length; i += 2) {
      let pastSample = waveFile.data.readUInt16LE(i - delaySamples);
      let currentSample = waveFile.data.readUInt16LE(i);
      let alteredSample = Math.floor(0.25 * (pastSample - sixteenBitZero)) + Math.floor(0.75 * (currentSample - sixteenBitZero)) + sixteenBitZero;
      waveFile.data.writeUInt16LE(alteredSample, i);
    }
  }
  return waveFile.buffer;
};
