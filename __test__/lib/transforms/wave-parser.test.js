'use strict';

const waveParser = require('../../../lib/transforms/wave-parser');

describe('wave-parser', () => {
  test('should return constructedWaveFile which contains buffer and other data attached', () => {
    const inputFilePath = `${__dirname}/../../assets/testclip.wav`;

    waveParser(inputFilePath)
      .then(parsedFile => {
        expect(parsedFile.buffer).toBeTruthy();
        expect(parsedFile.numberOfChannels).toEqual(2);
        expect(parsedFile.sampleRate).toEqual(8000);
        expect(parsedFile.bitsPerSample).toEqual(8);
        expect(parsedFile.subChunk2Size).toEqual(46986);
        expect(parsedFile.data).toBeTruthy();

      });

  });

  test('should return error if no file exists at path', () => {
    const inputFilePath = `${__dirname}/badpath.wav`;

    waveParser(inputFilePath)
      .then(Promise.reject)
      .catch(err => {
        expect(err.code).toBe('ENOENT');
      });

  });
});
