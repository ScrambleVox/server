'use strict';

const httpErrors = require('http-errors');
const User = require('../model/user');

module.exports = (request, response, next) => {
  if(!request.headers.authorization)
    return next(new httpErrors(400, `__ERROR__ authorization header required`));

  let base64AuthHeader = request.headers.authorization.split('Basic ')[1];

  if(!base64AuthHeader)
    return next(new httpErrors(400, `__ERROR__ basic authorization required`));

  let stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  let [username, password] = stringAuthHeader.split(':');

  if(!username || !password)
    return next(new httpErrors(400, `__ERROR__ username and password are required`));

  return User.findOne({username})
    .then(user => {
      if(!user)
        throw new httpErrors(404, `__ERROR__ username and password not required`);
      return user.verifyPassword(password);
    })
    .then(user => {
      request.user = user;
      return next();
    })
    .catch(next);
};