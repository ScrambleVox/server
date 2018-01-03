'use strict';

const sampleRateTransform = require('../../../lib/transforms/sample-rate-transform');

const SAMPLE_RATE_OFFSET = 24;

describe('sample-rate transform', () => {
  test('the file should output with a sample rate that is half the input sample', () => {
    const bigFile = {};
    bigFile.buffer = Buffer.from(new Uint16Array(30));
    bigFile.buffer.writeUInt32LE(8000, SAMPLE_RATE_OFFSET);
    bigFile.sampleRate = 8000;

    sampleRateTransform(bigFile);

    expect(bigFile.buffer.readUInt32LE(SAMPLE_RATE_OFFSET)).toBe(4000);
  });
});
