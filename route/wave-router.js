'use strict';

// ROUTER
const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuth = require('../lib/bearer-auth');
const Wave = require('../model/wave');

// FOR UPLOADING
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const S3 = require('../lib/s3');

const waveRouter = module.exports = new Router();

waveRouter.post('/waves', bearerAuth, upload.any(), (request, response, next) => {
  if(!request.user)
    return next(new httpErrors(404, '__ERROR__ not found'));

  if(!request.body.filename || request.files.length > 1 || request.files[0].fieldname !== 'wave')
    return next(new httpErrors(400, '__ERROR__ invalid request'));

  let file = request.files[0];
  let key = `${file.filename}.${file.originalname}`;

  return S3.upload(file.path, key)
    .then(url => {
      return new Wave({
        filename: request.body.filename,
        user: request.user._id,
        url,
      }).save;
    })
    .then(wave => response.json(wave)) //TODO: can change this to wave.url
    .catch(next);


});
