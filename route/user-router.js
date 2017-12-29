'use strict';

const {Router} = require(`express`);
const jsonParser = require(`body-parser`).json();
const User = require(`../model/user`);
const httpErrors = require(`http-errors`);

const basicAuthMiddleware = require(`../lib/basic-auth`);

const userRouter = module.exports = new Router();

userRouter.post(`/signup`, jsonParser, (request, response, next) => {
  if(!request.body.username || !request.body.password || !request.body.email){
    return next(new httpErrors(400, `__ERROR__ username, password, and email are required`));
  }

  return User.create(request.body.username, request.body.email, request.body.password)
    .then(user => user.createToken())
    .then(token => response.json({token}))
    .catch(next);
});

userRouter.get(`/login`, basicAuthMiddleware, (request, response, next) => {
  if(!request.user){
    return next(new httpErrors(404, `__ERROR__ Not Found`));
  }
  return request.user.createToken()
    .then(token => response.json({token}))
    .catch(next);
});
