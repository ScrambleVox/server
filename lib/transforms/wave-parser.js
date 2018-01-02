'use strict';

const fs = require(`fs`);
const waveParser = module.exports = {};

const RIFF_HEADER_OFFSET = 0;
const FILE_SIZE_OFFSET = 4;
const RIFF_FORMAT_OFFSET = 8;
const SUBCHUNK1_ID_OFFSET = 12;
const AUDIO_FORMAT_OFFSET = 20;
const NUMBER_OF_CHANNELS_OFFSET = 22;
const SAMPLE_RATE_OFFSET = 24;
const BITS_PER_SAMPLE_OFFSET = 34;
const SUBCHUNK2_ID_OFFSET = 36;
const SUBCHUNK2_SIZE_OFFSET = 40;
const DATA_OFFSET = 44;

waveParser.getFile = (filepath, callback) => {
  fs.readFile(filepath, (error, data) => {
    if(error){
      callback(error);
      return;
    }

    function ConstructWaveFile(buffer) {
      this.buffer = buffer;
      this.riff = buffer.slice(RIFF_HEADER_OFFSET, RIFF_HEADER_OFFSET + 4).toString('utf8');
      this.fileSize = buffer.readInt32LE(FILE_SIZE_OFFSET);
      this.riffType = buffer.slice(RIFF_FORMAT_OFFSET, RIFF_FORMAT_OFFSET + 4).toString('utf8');
      this.subChunk1Id = buffer.slice(SUBCHUNK1_ID_OFFSET, SUBCHUNK1_ID_OFFSET + 4).toString('utf8');
      this.audioFormat = buffer.readInt16LE(AUDIO_FORMAT_OFFSET);
      this.numberOfChannels = buffer.readInt16LE(NUMBER_OF_CHANNELS_OFFSET);
      this.sampleRate = buffer.readInt32LE(SAMPLE_RATE_OFFSET);
      this.bitPerSample = buffer.readInt16LE(BITS_PER_SAMPLE_OFFSET);
      this.subChunk2Id = buffer.slice(SUBCHUNK2_ID_OFFSET, SUBCHUNK2_ID_OFFSET + 4).toString('utf8');
      this.subChunk2Size = buffer.readInt32LE(SUBCHUNK2_SIZE_OFFSET);
      this.data = buffer.slice(DATA_OFFSET, this.subChunk2Size + DATA_OFFSET);
    }

    const constructedWaveFile = new ConstructWaveFile(data);

    if (constructedWaveFile.riff !== 'RIFF'){
      throw new TypeError('incorrect file type, must be RIFF format');
    }

    if (constructedWaveFile.fileSize > 1000000) {
      throw new TypeError('file too large, please limit file size to less than 1MB');
    }

    if (constructedWaveFile.riffType !== 'WAVE') {
      throw new TypeError('file must be a WAVE');
    }

    if (constructedWaveFile.subChunk1Id !== 'fmt ') {
      throw new TypeError('the first subchunk must be fmt');
    }

    if (constructedWaveFile.audioFormat !== 1) {
      throw new TypeError('wave file must be uncompressed linear PCM');
    }

    if (constructedWaveFile.numberOfChannels > 2){
      throw new TypeError('wave file must have 2 or less channels');
    }

    // watch out for sample rate increases in the transformations that will push this higher than 48k
    if (constructedWaveFile.sampleRate > 48000){
      throw new TypeError('wave file must have sample rate of less than 48k');
    }

    if (constructedWaveFile.subChunk2Id !== 'data') {
      throw new TypeError('subchunk 2 must be data');
    }


    callback(null, constructedWaveFile);
  });
};

//use buffer.write Int16LE with offset provided to overwrite a specific piece of the wave file
