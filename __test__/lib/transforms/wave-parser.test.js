'use strict';

const waveParser = require('../../../lib/transforms/wave-parser');

describe('wave-parser', () => {
  test('should return constructedWaveFile which contains buffer and other data attached', done => {
    const inputFilePath = `${__dirname}/../../assets/testclip.wav`;
    const numberOfChannels = 2;
    const sampleRate = 8000;
    const bitPerSample = 8;
    const subChunk2Size = 46986;

    let constructedWaveFile = null;

    const callback = (error, data) => {
      constructedWaveFile = data;
      expect(error).toBeNull();
      expect(constructedWaveFile.buffer).toBeTruthy();
      expect(constructedWaveFile.numberOfChannels).toEqual(numberOfChannels);
      expect(constructedWaveFile.sampleRate).toEqual(sampleRate);
      expect(constructedWaveFile.bitPerSample).toEqual(bitPerSample);
      expect(constructedWaveFile.subChunk2Size).toEqual(subChunk2Size);
      expect(constructedWaveFile.data).toBeTruthy();
      done();
    };

    waveParser.getFile(inputFilePath, callback);
  });

  test('should return error if no file exists at path', done => {
    const inputFilePath = `${__dirname}/badpath.wav`;


    const callback = (error) => {
      expect(error).toBeTruthy();
      done();
    };

    waveParser.getFile(inputFilePath, callback);

  });
});
