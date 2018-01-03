'use strict';

require('./lib/setup');
// require('dotenv').config();

const superagent = require('superagent');
const server = require('../lib/server');
const userMock = require('./lib/user-mock-factory');
const waveMock = require('./lib/wave-mock-factory');

const __API_URL__ = `http://localhost:${process.env.PORT}`;

describe('Wave router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(waveMock.remove);

  describe('POST /waves/bitcrusher', () => {
    test('POST /waves/bitcrusher should return a 200 status and a url if there are no errors', () => {
      let tempUserMock = null;
      return userMock.create()
        .then(userMock => {
          tempUserMock = userMock;

          return superagent.post(`${__API_URL__}/waves/bitcrusher`)
            .set('Authorization', `Bearer ${tempUserMock.token}`)
            .field('wavename', 'cornsilk')
            .attach('wave', `${__dirname}/assets/testclip.wav`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.wavename).toEqual('cornsilk');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        });
    });

    test('POST /waves/bitcrusher should return a 400 status if there is a bad request', () => {
      let tempUserMock = null;
      return userMock.create()
        .then(userMock => {
          tempUserMock = userMock;

          return superagent.post(`${__API_URL__}/waves/bitcrusher`)
            .set('Authorization', `Bearer ${tempUserMock.token}`)
            .field('WRONG', 'cornsilk')
            .attach('wave', `${__dirname}/assets/testclip.wav`)
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('POST /waves/bitcrusher should return a 401 status if the POST is unauthorized', () => {
      return userMock.create()
        .then(() => superagent.post(`${__API_URL__}/waves/bitcrusher`)
          .set('Authorization', 'Bearer ofBadTokens')
          .field('wavename', 'cornsilk')
          .attach('wave', `${__dirname}/assets/testclip.wav`)
          .then(Promise.reject)
          .catch(response => {
            expect(response.status).toEqual(401);
          }));
    });
  });

  describe('DELETE /waves', () => {

    test('DELETE /waves should expect a status code of 204 if there are no errors deleting', () => {
      let tempWaveMock = null;
      return waveMock.create()
        .then(waveMock => {
          tempWaveMock = waveMock;
          return superagent.delete(`${__API_URL__}/waves`)
            .set('Authorization', `Bearer ${tempWaveMock.userMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('DELETE /waves should expect a status code of 401 if token is bad', () => {
      return superagent.delete(`${__API_URL__}/waves`)
        .set('Authorization', `Bearer superIllegalToken`)
        .then(Promise.reject)
        .catch( response => expect(response.status).toEqual(401));
    });


    test('DELETE /waves should expect a status code of 404 if the user has no saved wave', () => {
      let tempUserMock = null;
      return userMock.create()
        .then(mock => {
          tempUserMock = mock;
          return superagent.delete(`${__API_URL__}/waves`)
            .set('Authorization', `Bearer ${tempUserMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => expect(response.status).toEqual(404));
    });

  });
});
