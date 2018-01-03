'use strict';

module.exports = data => {
  
  return new Promise((resolve, reject) => {
    
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
  
    function ParsedWave(buffer) {
      this.buffer = buffer;
      this.riff = buffer.slice(RIFF_HEADER_OFFSET, RIFF_HEADER_OFFSET + 4).toString('utf8');
      this.fileSize = buffer.readUInt32LE(FILE_SIZE_OFFSET);
      this.riffType = buffer.slice(RIFF_FORMAT_OFFSET, RIFF_FORMAT_OFFSET + 4).toString('utf8');
      this.subChunk1Id = buffer.slice(SUBCHUNK1_ID_OFFSET, SUBCHUNK1_ID_OFFSET + 4).toString('utf8');
      this.audioFormat = buffer.readUInt16LE(AUDIO_FORMAT_OFFSET);
      this.numberOfChannels = buffer.readUInt16LE(NUMBER_OF_CHANNELS_OFFSET);
      this.sampleRate = buffer.readUInt32LE(SAMPLE_RATE_OFFSET);
      this.bitsPerSample = buffer.readUInt16LE(BITS_PER_SAMPLE_OFFSET);
      this.subChunk2Id = buffer.slice(SUBCHUNK2_ID_OFFSET, SUBCHUNK2_ID_OFFSET + 4).toString('utf8');
      this.subChunk2Size = buffer.readUInt32LE(SUBCHUNK2_SIZE_OFFSET);
      this.data = buffer.slice(DATA_OFFSET, this.subChunk2Size + DATA_OFFSET);
    }

    const parsedWaveFile = new ParsedWave(data);

    if (parsedWaveFile.riff !== 'RIFF'){
      return reject(new TypeError('incorrect file type, must be RIFF format'));
    }

    if (parsedWaveFile.fileSize > 1000000) {
      return reject(new TypeError('file too large, please limit file size to less than 1MB'));
    }

    if (parsedWaveFile.riffType !== 'WAVE') {
      return reject(new TypeError('file must be a WAVE'));
    }

    if (parsedWaveFile.subChunk1Id !== 'fmt ') {
      return reject(new TypeError('the first subchunk must be fmt'));
    }

    if (parsedWaveFile.audioFormat !== 1) {
      return reject(new TypeError('wave file must be uncompressed linear PCM'));
    }

    if (parsedWaveFile.numberOfChannels > 2){
      return reject(new TypeError('wave file must have 2 or less channels'));
    }

    // Andrew - watch out for sample rate increases in the transformations that will push this higher than 48k
    if (parsedWaveFile.sampleRate > 48000){
      return reject(new TypeError('wave file must have sample rate of less than 48k'));
    }

    if (parsedWaveFile.bitsPerSample !== 8 && parsedWaveFile.bitsPerSample !== 16){
      return reject(new TypeError(`file's bit depth must be 8 or 16`));
    }

    if (parsedWaveFile.subChunk2Id !== 'data') {
      return reject(new TypeError('subchunk 2 must be data'));
    }

    return resolve(parsedWaveFile);
  });
};

//use buffer.write Int16LE with offset provided to overwrite a specific piece of the wave file
