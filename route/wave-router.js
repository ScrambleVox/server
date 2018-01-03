'use strict';

// ROUTER
const {Router} = require('express');
const httpErrors = require('http-errors');
const fsx = require('fs-extra');
const bearerAuth = require('../lib/middleware/bearer-auth');
const waveParser = require('../lib/transforms/wave-parser');
const bitCrusher = require('../lib/transforms/bitcrusher');
const downPitcher = require('../lib/transforms/sample-rate-transform');
const Wave = require('../model/wave');

// FOR UPLOADING
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const S3 = require('../lib/middleware/s3');

const waveRouter = module.exports = new Router();

waveRouter.post('/waves/:transform', bearerAuth, upload.any(), (request, response, next) => {
  if(!request.user){
    return next(new httpErrors(404, '__ERROR__ not found'));
  }

  if(!request.body.wavename || request.files.length > 1 || request.files[0].fieldname !== 'wave' || !request.params.transform){
    return next(new httpErrors(400, '__ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;
  const tempFilePath = `${__dirname}/../temp/transform-temp.wav`;
  let transformedFile = null;

  return fsx.readFile(file.path) 
    .then(data => {
      const parsedFile = waveParser(data);
      if(request.params.transform === 'bitcrusher'){
        transformedFile = bitCrusher(parsedFile);
      }
      if(request.params.transform === 'downpitcher'){
        transformedFile = downPitcher(parsedFile);
      }
      return fsx.writeFile(tempFilePath, transformedFile)
        .then(() => {
          return S3.upload(tempFilePath, key)
            .then(url => {
              return new Wave({
                wavename: request.body.wavename,
                user: request.user._id,
                url,
              }).save();
            })
            .then(wave => response.json(wave)) //TODO: can change this to download or other response method? download wave.url?
            .catch(next);
        });
    });
});