'use strict';

const fs = require(`fs`);
const waveWriter = module.exports = {};

waveWriter.writeFile = (outputFilePath, constructedWaveFile, callback) => {
  fs.writeFile(outputFilePath, constructedWaveFile.buffer, error => {
    if(error) {
      callback(error);
      return;
    }
    callback(null);
  });
};