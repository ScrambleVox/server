'use strict';

const waveParser = require('../lib/transforms/wave-parser');
const waveWriter = require('../lib/transforms/wave-writer');
const bitCrusher = require('../lib/transforms/bitcrusher');


describe('full process transform', () => {
  test('file will be read, bitcrushed and then file will be written with new bits', () => {
    const inputFilePath = `${__dirname}/../../assets/testclip.wav`;
    
    waveParser.getFile(inputFilePath, (error, data) => {
      let constructedWaveFile = data;
      bitCrusher(constructedWaveFile);
      console.log(constructedWaveFile.data[0]);
      console.log(constructedWaveFile.data[1]);
      console.log(constructedWaveFile.data[2]);
      console.log(constructedWaveFile.data[3]);
      expect(constructedWaveFile.data[0]).toEqual(192);
      expect(constructedWaveFile.data[1]).toEqual(128);
      expect(constructedWaveFile.data[2]).toEqual(64);
      expect(constructedWaveFile.data[3]).toEqual(0);

      waveWriter.writeFile('./temp/full-process-transform.wav', constructedWaveFile, (error) => {
        if(error) {
          console.error(error);
          return;
        }
      });
    });
  });

});

