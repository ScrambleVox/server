'use strict';

const fs = require(`fs`);
const waveParser = require('./wave-parser');

const waveWriter = module.exports = {};


waveWriter.writeFile = (outputFilePath, constructedWaveFile, callback) => {
  // console.log(waveParser.constructedWaveFile);
  fs.writeFile(outputFilePath, constructedWaveFile.buffer, error => {
    if(error) {
      callback(error);
      return;
    }
    callback(null);
  });
};