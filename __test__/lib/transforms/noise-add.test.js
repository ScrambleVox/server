'use strict';

const noiseAdd = require('../../../lib/transforms/noise-add');

describe('testing noiseAdd transform module', () => {
  test('expect that noiseAdd changes values for 8 bit file', () => {
    const file = {};
    file.bitsPerSample = 8;
    file.data = Buffer.from([245, 10, 127, 137]);
    noiseAdd(file);
    expect(file.data[0]).not.toEqual(245);
    expect(file.data[1]).not.toEqual(10);
    expect(file.data[2]).not.toEqual(127);
    expect(file.data[3]).not.toEqual(137);
  });

  test('expect that noiseAdd changes values for 16 bit file', () => {
    const bigFile = {};
    bigFile.bitsPerSample = 16;
    bigFile.data = Buffer.from(new Uint16Array(8));
    bigFile.data.writeUInt16LE(64535, 0);
    bigFile.data.writeUInt16LE(10, 2);
    bigFile.data.writeUInt16LE(32767, 4);
    bigFile.data.writeUInt16LE(33767, 6);
    noiseAdd(bigFile);
    expect(bigFile.data.readUInt16LE(0)).not.toEqual(64535);
    expect(bigFile.data.readUInt16LE(2)).not.toEqual(10);
    expect(bigFile.data.readUInt16LE(4)).not.toEqual(32767);
    expect(bigFile.data.readUInt16LE(6)).not.toEqual(33767);
  });
});