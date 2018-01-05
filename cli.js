#!/usr/bin/env node
'use strict';

const superagent = require('superagent');
const fsx = require('fs-extra');
const help = require('./help');

const __API_URL__ = 'http://localhost:3000';
const TOKEN_STORAGE = '~/.scramblevox-token.json';
let token = null;
const transforms = ['bitcrusher', 'delay', 'noise', 'reverse', 'downpitcher', 'scrambler'];

fsx.ensureFile(TOKEN_STORAGE)
  .then(() => {
    fsx.readJson(TOKEN_STORAGE, {throws: false})
      .then(obj => {
        if (obj){
          token = obj.token;
        }
      })
      .catch(err => console.log(err));
  })
  .catch(err => console.log(err));

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
  const filePathArray = filePath.split('/');
  const fileName = filePathArray[filePathArray.length - 1];
  superagent.post(`${__API_URL__}/waves/${process.argv[3]}`)
    .set('Authorization', `Bearer ${token}`)
    .field('wavename', fileName)
    .attach('wave', `${__dirname}/${filePath}`)
    .then(response => {
      console.log(`Follow this link to download your transformed file:\n${response.body.url}\nNote that new transforms will remove existing links`);
    })
    .catch(err => console.log(err));
}

else if (process.argv[3] === 'get'){
  superagent.get(`${__API_URL__}/waves/${process.argv[3]}`)
    .set('Authorization', `Bearer ${token}`)
    .then(response => {
      console.log(`Follow this link to download your transformed file:\n${response.body.url}`);
    })
    .catch(err => console.log(err));
}

else if (process.argv[3] === 'delete'){
  superagent.delete(`${__API_URL__}/waves/${process.argv[3]}`)
    .set('Authorization', `Bearer ${token}`)
    .then(() => {
      console.log('Delete successful');
    })
    .catch(err => console.log(err));
}

else {
  console.log(`invalid command, type 'scramblevox help' for a list of valid commands and their descriptions`);
}