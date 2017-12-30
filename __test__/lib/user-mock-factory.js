'use strict';

const User = require(`../../model/user`);
const faker = require(`faker`);

const userMockFactory = module.exports = {};

userMockFactory.create = () => {
  let mock = null;
  mock.request({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.lorem.words(3),
  });

  return User.create(mock.request.username, mock.request.email, mock.request.password)
    .then(user => {
      mock.user = user;
      return user.createToken();
    })
    .then(token => {
      mock.token = token;
      return User.findById(mock.user._id);
    })
    .then(user => {
      mock.user = user;
      return mock;
    });
};

userMockFactory.remove = () => User.remove({});
