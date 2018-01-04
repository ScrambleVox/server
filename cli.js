#!/usr/bin/env node
'use strict';

const superagent = require('superagent');
const help = require('./help');
const __API_URL__ = 'http://localhost:3000';
const TOKEN_STORAGE = '~/.scramblevox-token.json';

if (process.argv[3] === 'help'){
  //call help file
}

if (process.argv[3] === 'signup'){
  const userName = process.argv[4];
  const passWord = process.argv[5];
  const email = process.argv[6];

  //post user/signup
}

if (process.argv[3] === 'login'){
  const userName = process.argv[4];
  const passWord = process.argv[5];
  //get user/login
}

const transforms = ['bitcrusher', 'delay', 'noise', 'reverse', 'downpitcher', 'scrambler'];

if (transforms.indexOf(process.argv[3]) !== -1){
  const filePath = process.argv[4];
  // post waves/${process.argv[3]}
}

if (process.argv[3] === 'get'){
  //get waves/
}

if (process.argv[3] === 'delete'){
  //delete waves/
}
