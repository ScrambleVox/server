'use strict';

const waveParser = require('../../../lib/transforms/wave-parser');
const waveWriter = require('../../../lib/transforms/wave-writer');
const sampleRateTransform = require('../../../lib/transforms/sample-rate-transform');


describe('sample-rate transform', () => {
  test('the file should output with a sample rate that is half the input sample', done => {
    const inputFilePath = `${__dirname}/../../assets/testclip.wav`;
    
    waveParser.getFile(inputFilePath, (error, data) => {
      let constructedWaveFile = data;
      sampleRateTransform(constructedWaveFile, (error, data) => {
        expect(constructedWaveFile.sampleRate).toBe(4000);
        waveWriter.writeFile('./temp/sample-rate-output.wav', constructedWaveFile, (error) => {
          if(error) {
            console.error(error);
            return;
          }
        });
      });
    });

    done();
  });

});
