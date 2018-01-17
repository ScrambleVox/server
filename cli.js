#!/usr/bin/env node
'use strict';

const superagent = require('superagent');
const fsx = require('fs-extra');
const help = require('./help');

const __API_URL__ = 'https://scramblevox.herokuapp.com';
const TOKEN_STORAGE = `${process.env.HOME}/.scramblevox-token.json`;
let token = null;
const transforms = ['bitcrusher', 'delay', 'noise', 'reverse', 'downpitcher'];

// REVIEW: I found the indentation for the newline .then() statements
// to be tricky. Consider bringing them to the same level of indentation
// as whatever starts them so there's not "dangling" indentation left when
// the entire statement is done.
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

// REVIEW: simplify the structure of these if/else statements by making
// the code between each branch ALWAYS be just a single function call.
// Encapsulate the functionality of each CLI action inside a function
// instead of writing it in the middle of the if/else branch.
//
// REVIEW: Also, it was weird to have "else if" lines appear two
// lines below another if statement, like below. Replacing the inline
// code with single function calls makes the entire stucture much more legible.
//
// if (process.argv[2] === 'help'){
//    help();
//  }
// 
//  else if (process.argv[2] === 'signup'){
//
if (process.argv[2] === 'help'){
  help();
} else if (process.argv[2] === 'signup'){
  signup();
} else if (process.argv[2] === 'login'){
  login();
} else if (process.argv[2] === 'logout'){
  logout();
} else if (transforms.includes(process.argv[2])){
  transform();
} else if (process.argv[2] === 'get'){
  cliGet()
} else if (process.argv[2] === 'delete'){
  cliDelete()
} else {
  console.log(`invalid command, type 'scramblevox help' for a list of valid commands and their descriptions`);
}

function signup() {
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

function login() {
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

function logout() {
  fsx.writeJSON(TOKEN_STORAGE, {})
  .then(() => console.log('Logout successful. Goodbye!'))
  .catch(err => console.log(err));
}

function transform() {
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
      // REVIEW: This is a lone console.log statement.
      // Break it into several console.log statements, especially because
      // you already have newlines in it!
      console.log('Follow this link to download your transformed file:');
      console.log(response.body.url);
      console.log('Note that new transforms will remove existing links');
    })
    .catch(err => console.log(err.status, err.response.text));
  });
}

function cliGet() {
  fsx.readJson(TOKEN_STORAGE, { throws: false })
  .then(obj => {
    if (obj) {
      token = obj.token;
    }
    return superagent.get(`${__API_URL__}/waves`)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        // REVIEW: again, just break this into two lines
        // Notice how it gets simpler because you happen to not have to use
        // the string interpolation any more either!
        console.log('Follow this link to download your transformed file:');
        console.log(response.body.url);
      })
      .catch(err => console.log(err.status, err.response.text));
  });
}

function cliDelete() {
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
