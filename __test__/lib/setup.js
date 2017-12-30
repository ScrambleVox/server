'use strict';

const faker = require('faker');
const awsSDKMock = require('aws-sdk-mock');

process.env.AWS_ACCESS_KEY_ID = 'secretkeyid';
process.env.AWS_BUCKET = 'mycoolbucket';
process.env.AWS_SECRET_ACCESS_KEY = 'mysecretkeyshhhhh';
process.env.SECRET_SALT = 'Password123!';
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.PORT = 3000;

