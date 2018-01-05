#!/usr/bin/env node
'use strict';

const superagent = require('superagent');
const fsx = require('fs-extra');
const help = require('./help');

const __API_URL__ = 'https://scramblevox.herokuapp.com';
const TOKEN_STORAGE = `${process.env.HOME}/.scramblevox-token.json`;
let token = null;
const transforms = ['bitcrusher', 'delay', 'noise', 'reverse', 'downpitcher'];

fsx.ensureFile(TOKEN_STORAGE)
  .then(() => {
    return fsx.readJson(TOKEN_STORAGE, {throws: false})
      .then(obj => {
        if (obj){
          token = obj.token;
        }
      })
      .catch(err => console.log(err));
  })
  .catch(err => console.log(err));

if (process.argv[2] === 'help'){
  help();
}

else if (process.argv[2] === 'signup'){
  const username = process.argv[3];
  const password = process.argv[4];
  const email = process.argv[5];
  superagent.post(`${__API_URL__}/signup`)
    .send({username, email, password})
    .then(response => {
      fsx.writeJSON(TOKEN_STORAGE, {token: response.body.token})
        .then(() => console.log('Signup successful'))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err.status, err.response.text));
}

else if (process.argv[2] === 'login'){
  const username = process.argv[3];
  const password = process.argv[4];
  superagent.get(`${__API_URL__}/login`)
    .auth(username, password)
    .then(response => {
      fsx.writeJSON(TOKEN_STORAGE, {token: response.body.token})
        .then(() => console.log('Login successful'))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err.status, err.response.text));
}

else if (process.argv[2] === 'logout'){
  fsx.writeJSON(TOKEN_STORAGE, {})
    .then(() => console.log('Logout successful. Goodbye!'))
    .catch(err => console.log(err));
}

else if (transforms.includes(process.argv[2])){
  const filePath = process.argv[3];
  const filePathArray = filePath.split('/');
  const fileName = filePathArray[filePathArray.length - 1];
  fsx.readJson(TOKEN_STORAGE, { throws: false })
    .then(obj => {
      if (obj) {
        token = obj.token;
      }
      return superagent.post(`${__API_URL__}/waves/${process.argv[2]}`)
        .set('Authorization', `Bearer ${token}`)
        .field('wavename', fileName)
        .attach('wave', `${__dirname}/${filePath}`)
        .then(response => {
          console.log(`Follow this link to download your transformed file:\n${response.body.url}\nNote that new transforms will remove existing links`);
        })
        .catch(err => console.log(err.status, err.response.text));
    });
}

else if (process.argv[2] === 'get'){
  fsx.readJson(TOKEN_STORAGE, { throws: false })
    .then(obj => {
      if (obj) {
        token = obj.token;
      }
      return superagent.get(`${__API_URL__}/waves`)
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          console.log(`Follow this link to download your transformed file:\n${response.body.url}`);
        })
        .catch(err => console.log(err.status, err.response.text));
    });
}

else if (process.argv[2] === 'delete'){
  fsx.readJson(TOKEN_STORAGE, { throws: false })
    .then(obj => {
      if (obj) {
        token = obj.token;
      }
      return superagent.delete(`${__API_URL__}/waves`)
        .set('Authorization', `Bearer ${token}`)
        .then(() => {
          console.log('Delete successful');
        })
        .catch(err => console.log(err.status, err.response.text));
    });
}

else {
  console.log(`invalid command, type 'scramblevox help' for a list of valid commands and their descriptions`);
}