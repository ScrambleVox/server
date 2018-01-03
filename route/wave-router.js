'use strict';

// ROUTER
const {Router} = require('express');
const httpErrors = require('http-errors');
const fsx = require('fs-extra');
const bearerAuth = require('../lib/middleware/bearer-auth');
const waveParser = require('../lib/transforms/wave-parser');
const bitCrusher = require('../lib/transforms/bitcrusher');
const Wave = require('../model/wave');

// FOR UPLOADING
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const S3 = require('../lib/middleware/s3');

const waveRouter = module.exports = new Router();

// TODO: make each post specific to the transform.
waveRouter.post('/waves/:transform', bearerAuth, upload.any(), (request, response, next) => {
  if(!request.user)
    return next(new httpErrors(404, '__ERROR__ not found'));

  if(!request.body.wavename || request.files.length > 1 || request.files[0].fieldname !== 'wave')
    return next(new httpErrors(400, '__ERROR__ invalid request'));

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;
  console.log(file);
  const tempFilePath = '../../temp/transform-temp.wav';
  let bitCrushed = null;

  return fsx.readFile(file) 
    .then(data => {
      const parsedFile = waveParser(data);
      if(request.params.transform === 'bitcrusher') {
        bitCrushed = bitCrusher(parsedFile);
      }
      return fsx.writeFile(tempFilePath, bitCrushed)
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
   

  

  //check to see what the file binary stream is from multer and create a new variable to pass to wave parser

  // return waveParser(file)
  //   .then(parsedFile => {
      
  // do we need to make bitcrusher return a promise?
  // bitCrusher(parsedFile);

  // we need to save the file here and get the new file path from where we are temporarily saving our written transformed file.

  
});
// });
