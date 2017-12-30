'use strict';

require('./lib/setup');
const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const userMock = require('./lib/user-mock-factory');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('User Router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(userMock.remove);

  describe('POST /signup', () => {

    test('POST creating an account should respond with 200 and a token if there are no errors', () => {
      return superagent.post(`${__API_URL__}/signup`)
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    test('POST /signup - an incomplete request should return a 400', () => {
      return superagent.post(`${__API_URL__}/signup`)
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('POST /signup - a duplicate request should return a 409', () => {
      return superagent.post(`${__API_URL__}/signup`)
        .send({
          username: 'double',
          email: 'double@redundant.com',
          password: 'redundantRedundancy',
        })
        .then(() => {
          return superagent.post(`${__API_URL__}/signup`)
            .send({
              username: 'double',
              email: 'double@redundant.com',
              password: 'redundantRedundancy',
            })
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(409);
            });

        });
    });
  });

  describe('GET /login', () => {
    test('GET /login should get a 200 status code and a token if there are no errors', () => {
      return userMock.create()
        .then(mock => {
          return superagent.get(`${__API_URL__}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    test('GET /login should get a 400 status if authentication is not sent', () => {
      return userMock.create()
        .then(() => {
          return superagent.get(`${__API_URL__}/login`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('GET /login should get a 404 status if user does not exist', () => {
      return userMock.create()
        .then(() => {
          return superagent.get(`${__API_URL__}/login`)
            .auth(faker.internet.userName(), faker.internet.password());
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

});