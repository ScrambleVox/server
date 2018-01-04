'use strict';

const bitcrusher = require('../../../lib/transforms/bitcrusher');

describe('testing bitcrusher transform module', () => {
  test('expect that bitcrusher changes values for 8 bit file', () => {
    const file = {};
    file.bitsPerSample = 8;
    file.data = Buffer.from([248, 129, 70, 4]);
    bitcrusher(file);
    expect(file.data[0]).toEqual(192);
    expect(file.data[1]).toEqual(128);
    expect(file.data[2]).toEqual(64);
    expect(file.data[3]).toEqual(0);
  });

  test('expect that bitcrusher changes values for 16 bit file', () => {
    const bigFile = {};
    bigFile.bitsPerSample = 16;
    bigFile.data = Buffer.from(new Uint16Array(8));
    bigFile.data.writeUInt16LE(50000, 0);
    bigFile.data.writeUInt16LE(33000, 2);
    bigFile.data.writeUInt16LE(20000, 4);
    bigFile.data.writeUInt16LE(100, 6);
    bitcrusher(bigFile);
    expect(bigFile.data.readUInt16LE(0)).toEqual(49152);
    expect(bigFile.data.readUInt16LE(2)).toEqual(32768);
    expect(bigFile.data.readUInt16LE(4)).toEqual(16384);
    expect(bigFile.data.readUInt16LE(6)).toEqual(0);
  });
});
