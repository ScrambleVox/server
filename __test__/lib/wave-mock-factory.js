'use strict';

const Wave = require(`../../model/wave`);
const userMockFactory = require('./user-mock-factory');
const faker = require(`faker`);

const waveMockFactory = module.exports = {};

waveMockFactory.create = () => {
  const mock = {};
  return userMockFactory.create()
    .then(userMock => {
      mock.userMock = userMock;
      return new Wave({
        user: userMock.user._id,
        wavename: faker.lorem.words(1),
        url: faker.internet.url(),
      }).save();
    })
    .then(wave => {
      mock.wave = wave;
      return mock;
    });
};

waveMockFactory.remove = () => {
  return Promise.all([
    userMockFactory.remove(),
    Wave.remove({}),
  ]);
};