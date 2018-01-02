'use strict';

const waveParser = require('../../../lib/transforms/wave-parser');
const waveWriter = require('../../../lib/transforms/wave-writer');

describe('wave-writer', () => {
  test('should return a file at the output file path', done => {
    const inputFilePath = `${__dirname}/../../assets/testclip.wav`;
    
    let constructedWaveFile = null;
    const callback = (error, data) => {
      constructedWaveFile = data;
      
      done();
    };

    waveParser.getFile(inputFilePath, callback);
    waveWriter.writeFile('./temp/output.wav', constructedWaveFile, callback);
    expect('./temp/output.wav').toBeTruthy();
  });
});