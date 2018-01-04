'use strict';

const delay = require('../../../lib/transforms/delay');

describe('testing delay transform module', () => {
  test('expect that delay changes values for 8 bit file', () => {
    const file = {};
    file.bitsPerSample = 8;
    file.sampleRate = 10;
    file.data = Buffer.from([255, 0, 127, 137]);
    delay(file);
    expect(file.data[0]).toEqual(255);
    expect(file.data[1]).toEqual(127);
    expect(file.data[2]).toEqual(127);
    expect(file.data[3]).toEqual(134);
  });

  test('expect that delay changes values for 16 bit file', () => {
    const bigFile = {};
    bigFile.bitsPerSample = 16;
    bigFile.sampleRate = 20;
    bigFile.data = Buffer.from(new Uint16Array(8));
    bigFile.data.writeUInt16LE(65535, 0);
    bigFile.data.writeUInt16LE(0, 2);
    bigFile.data.writeUInt16LE(32767, 4);
    bigFile.data.writeUInt16LE(33767, 6);
    delay(bigFile);
    expect(bigFile.data.readUInt16LE(0)).toEqual(65535);
    expect(bigFile.data.readUInt16LE(2)).toEqual(32767);
    expect(bigFile.data.readUInt16LE(4)).toEqual(32767);
    expect(bigFile.data.readUInt16LE(6)).toEqual(33517);
  });
  
  test('expect that delay still works correctly for 16 bit file when odd sample amount given', () => {
    const bigFile = {};
    bigFile.bitsPerSample = 16;
    bigFile.sampleRate = 10;
    bigFile.data = Buffer.from(new Uint16Array(8));
    bigFile.data.writeUInt16LE(65535, 0);
    bigFile.data.writeUInt16LE(0, 2);
    bigFile.data.writeUInt16LE(32767, 4);
    bigFile.data.writeUInt16LE(33767, 6);
    delay(bigFile);
    expect(bigFile.data.readUInt16LE(0)).toEqual(65535);
    expect(bigFile.data.readUInt16LE(2)).toEqual(32767);
    expect(bigFile.data.readUInt16LE(4)).toEqual(32767);
    expect(bigFile.data.readUInt16LE(6)).toEqual(33517);
  });
});