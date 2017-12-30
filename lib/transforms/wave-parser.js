'use strict';

const fs = require(`fs`);
const waveParser = module.exports = {};

const NUMBER_OF_CHANNELS_OFFSET = 22;
const SAMPLE_RATE_OFFSET = 24;
const BITS_PER_SAMPLE_OFFSET = 34;
const DATA_OFFSET = 44;
const SUBCHUNK2_SIZE_OFFSET = 40;

waveParser.getFile = (filepath, callback) => {
  fs.readFile(filepath, (error, data) => {
    if(error){
      callback(error);
      return;
    }

    function ConstructWaveFile(buffer) {
      this.buffer = buffer;
      this.numberOfChannels = buffer.readInt16LE(NUMBER_OF_CHANNELS_OFFSET);
      this.sampleRate = buffer.readInt32LE(SAMPLE_RATE_OFFSET);
      this.bitPerSample = buffer.readInt16LE(BITS_PER_SAMPLE_OFFSET);
      this.subChunk2Size = buffer.readInt32LE(SUBCHUNK2_SIZE_OFFSET);
      this.data = buffer.slice(DATA_OFFSET, this.subChunk2Size + DATA_OFFSET);
    }

    const constructedWaveFile = new ConstructWaveFile(data);
    callback(null, constructedWaveFile);
  });
};

//use buffer.write Int16LE with offset provided to overwrite a specific piece of the wave file
