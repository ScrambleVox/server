#!/usr/bin/env node
'use strict';

const superagent = require('superagent');
const fsx = require('fs-extra');
const help = require('./help');

const __API_URL__ = 'http://localhost:3000';
const TOKEN_STORAGE = '~/.scramblevox-token.json';

const transforms = ['bitcrusher', 'delay', 'noise', 'reverse', 'downpitcher', 'scrambler'];

if (process.argv[3] === 'help'){
  help();
}

else if (process.argv[3] === 'signup'){
  const username = process.argv[4];
  const password = process.argv[5];
  const email = process.argv[6];
  superagent.post(`${__API_URL__}/signup`)
    .send({username, email, password})
    .then(response => {
      fsx.writeJSON(TOKEN_STORAGE, {token: response.body.token})
        .then(() => console.log('Signup successful'))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

else if (process.argv[3] === 'login'){
  const username = process.argv[4];
  const password = process.argv[5];
  superagent.get(`${__API_URL__}/login`)
    .auth(username, password)
    .then(response => {
      fsx.writeJSON(TOKEN_STORAGE, {token: response.body.token})
        .then(() => console.log('Login successful'))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

else if (transforms.includes(process.argv[3])){
  const filePath = process.argv[4];
  superagent.post(`waves/${process.argv[3]}`);
}

else if (process.argv[3] === 'get'){
  //get waves/
}

else if (process.argv[3] === 'delete'){
  //delete waves/
}

else {
  console.log(`invalid command, type 'scramblevox help' for a list of valid commands and their descriptions`);
}