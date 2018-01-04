'use strict';

const eightBitZero = 127;
const sixteenBitZero = 32768;
const delayTime = 0.1;

module.exports = waveFile => {
  let bitsPerSample = waveFile.bitsPerSample;
  let sampleRate = waveFile.sampleRate;
  let delaySamples = Math.round(sampleRate * delayTime);
  if (bitsPerSample === 8) {
    for (let i = delaySamples; i < waveFile.data.length; i++) {
      let alteredSample = Math.floor(0.25 * (waveFile.data[i - delaySamples] - eightBitZero)) + Math.floor(0.75 * (waveFile.data[1] - eightBitZero)) + eightBitZero;
      waveFile.data.writeUInt8(alteredSample, i);
    }
  }
  if (bitsPerSample === 16) {
    for (let i = delaySamples; i < waveFile.data.length; i += 2) {
      let pastSample = waveFile.data.readUInt16LE(i - delaySamples);
      let currentSample = waveFile.data.readUInt16LE(i);
      let alteredSample = Math.floor(0.25 * (pastSample - sixteenBitZero)) + Math.floor(0.75 * (currentSample - sixteenBitZero)) + sixteenBitZero;
      waveFile.data.writeUInt16LE(alteredSample, i);
    }
  }
  return waveFile.buffer;
};
