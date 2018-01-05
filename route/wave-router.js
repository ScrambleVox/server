'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const fsx = require('fs-extra');
const bearerAuth = require('../lib/middleware/bearer-auth');
const waveParser = require('../lib/transforms/wave-parser');
const bitCrusher = require('../lib/transforms/bitcrusher');
const downPitcher = require('../lib/transforms/sample-rate-transform');
const delay = require('../lib/transforms/delay');
const noiseAdd = require('../lib/transforms/noise-add');
const reverse = require('../lib/transforms/reverse');

const Wave = require('../model/wave');
const s3 = require('../lib/middleware/s3');

const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const S3 = require('../lib/middleware/s3');

const waveRouter = module.exports = new Router();

waveRouter.post('/waves/:transform', bearerAuth, upload.any(), (request, response, next) => {

  if(!request.body.wavename || request.files.length > 1 || request.files[0].fieldname !== 'wave' || !request.params.transform){
    return next(new httpErrors(400, '__ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;
  const tempFilePath = `${__dirname}/../temp/transform-temp.wav`;
  let transformedFile = null;
  let transformFunc = null;

  if (request.params.transform === 'bitcrusher'){
    transformFunc = bitCrusher;
  }
  if (request.params.transform === 'downpitcher'){
    transformFunc = downPitcher;
  }
  if (request.params.transform === 'delay'){
    transformFunc = delay;
  }
  if (request.params.transform === 'noise'){
    transformFunc = noiseAdd;
  }
  if (request.params.transform === 'reverse'){
    transformFunc = reverse;
  }
  // if (request.params.transform === 'scrambler'){
  //   transformFunc = param => downPitcher(waveParser(delay(waveParser(bitCrusher(param)))));
  // }
  
  return Wave.findOne({user: request.user._id})
    .then(wave => {
      console.log(wave);
      if(wave){
        
        const urlArray = wave.url.split('/');
        const oldKey = urlArray[urlArray.length - 1]; 
        console.log(oldKey);
        console.log(key);
        
        return s3.remove(oldKey)
          .then(() => {
            return Wave.findOneAndRemove({user: request.user._id})
              .then(() => {
                return fsx.readFile(file.path)
                  .then(data => {
                    const parsedFile = waveParser(data);
                    transformedFile = transformFunc(parsedFile);
                    return fsx.writeFile(tempFilePath, transformedFile)
                      .then(() => {
                        console.log(key);
                        return S3.upload(tempFilePath, key)
                          .then(url => {
                            return new Wave({
                              wavename: request.body.wavename,
                              user: request.user._id,
                              url,
                            }).save();
                          })
                          .then(newWave => response.json(newWave))
                          .catch(next);
                      });
                  });
              });
          })
          .catch(next);
      } else {
        return fsx.readFile(file.path) 
          .then(data => {
            const parsedFile = waveParser(data);
            transformedFile = transformFunc(parsedFile);
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
                  .then(wave => response.json(wave))
                  .catch(next);
              });
          });
      }
    });

});

waveRouter.get('/waves', bearerAuth, (request, response, next) => {

  return Wave.findOne({ user: request.user._id })
    .then(wave => {
      if (!wave){
        throw new httpErrors(404, '__ERROR__ wave not found');
      }
      return response.json(wave);
    })
    .catch(next);
});

waveRouter.delete('/waves', bearerAuth, (request, response, next) => {
  return Wave.findOneAndRemove({user: request.user._id})
    .then(wave => {
      if(!wave){
        throw new httpErrors(404, '__ERROR__ wave not found');
      }
      let urlArray = wave.url.split('/');
      let key = urlArray[urlArray.length - 1]; 

      return s3.remove(key)
        .then(() => {
          return response.sendStatus(204);
        })
        .catch(next);
    })
    .catch(next);
});