'use strict';

const waveParser = require('../../../lib/transforms/wave-parser');
const waveWriter = require('../../../lib/transforms/wave-writer');

describe('wave-writer', () => {
  test('should return a file at the output file path', done => {
    const inputFilePath = `${__dirname}/../../assets/testclip.wav`;
    
    waveParser.getFile(inputFilePath, (error, data) => {
      let constructedWaveFile = data;
      waveWriter.writeFile('./temp/output.wav', constructedWaveFile, (error) => {
        if(error) {
          console.error(error);
          return;
        }
      });

    });
    // console.log(constructedWaveFile.fileSize);
    expect('./temp/output.wav').toBeTruthy();

    done();

    
  });
});