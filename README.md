# SCRAMBLE VOX
[![Build Status](https://travis-ci.org/ScrambleVox/server.svg?branch=readme)](https://travis-ci.org/ScrambleVox/server)
![Heroku](http://heroku-badge.herokuapp.com/?app=angularjs-crypto&style=flat&svg=1)

_scramble your voice by the method of your choice_


![picture of WAV file](/assets/AudacityWAV.png)
## Overview
This API is designed to take an audio file and return a transformed version of that file. HTTP requests can be made to the server, which is built on RESTful principles. Users can send an 8 bit or 16 bit uncompressed WAV audio file, and depending on the request, one of a number of provided transforms will be performed (see 'Transforms'). A command line tool is provided for proof of concept, and as a handy way to easily perform the various transforms.
***

## Getting Started
Familiarity with node, git and the command line are expected. To set up ScrambleVox on your own machine, take the following steps:
1. Fork or clone the repository onto your machine
2. Run 'npm i -g' from the cloned repo
3. Open two new tabs in the terminal. On one, type 'npm run dbon' to open a connection with the mongoDB database. On the other, type 'npm run start' to start the server.
4. To use the command line tools, type 'scramblevox `<command>`'. To see how to interact with the server using the CLI, simply type 'scramblevox', or 'scamblevox help' and the help file will be shown.

## To Record a WAV format audio sample for use with this app
[Audacity](https://www.audacityteam.org/) : free, open source, cross-platform audio software for multi-track recording and editing.
***
## Models

***
## Transforms
1. *Bitcrusher*: Reduces the resolution of the audio from 8 or 16 bits to 3 bits without affecting the actual bit depth of the audio file.

![picture of sound wave](/assets/bitcrusher.png)

2. *Down Pitcher*: Reduces the sample rate of the audio file by half, reducing the maximum possible frequency of the recording which results in a lower pitch.

![picture of sound wave](/assets/downpitcher.png)

3. *Delay*: Adds a portion of the sound wave from a prior sample in the audio buffer to the current position via a fixed interval; simulating an echo.

![picture of sound wave](/assets/delay.png)
![picture of sound wave](/assets/delay2.png)

4. *Noise Addition*: Adds or subtracts a small random number to each sample which has the effect of adding noise to the sound wave.  

![picture of sound wave](/assets/noise.png)

5. *Reverse*: Reverses the order of the bytes in the audio buffer of the sound wave.

![picture of sound wave](/assets/reverse.png)
***
## Routes
### Account setup
1. **POST** __api_url__/signup : Creates a new account and responds with a token. You must include a username (String), email (String), and password (String).
2. **GET** __api_url__/login : Accesses an account and returns a new token. You must send the account's username and password in the auth header of the request. If no basic authentication is included a 400 error will occur.

### Transforming files
1. **POST** __api_url__/waves/:transform : Transforms an audio file with the given transform function and returns a url to the modified file. You must send the token for your account in the authorization header of the request. If no bearer authorization is included a 401 error will occur. If a file already exists in the database, it will be removed from both AWS and the database first before uploading the new file.
2. **GET** __api_url__/waves : Returns the wave that is stored in the database which belongs to the user with whom the sent token is associated. A 401 will occur if the bearer authorization fails.
2 **DELETE** __api_url__/waves : Removes the wave which belongs to the user with whom the sent token is associated. The file will be removed from both AWS and the database. A 401 will occur if bearer authorization fails.

***
## Tests
ScrambleVox implements continuous integration (CI) via Travis CI and is deployed on Heroku. Tests are performed with Jest. Pushes to master will be tested by Travis, and if all tests pass, an updated build will be automatically deployed on Heroku.

Tests examine both proper behavior for each route as well as behavior when errors occur. The following tests can be executed by running 'npm run test' after installing Jest with 'npm i jest'. Note: in order to successfully run the tests, the mongodb server must be on, and the server must be off.

1. User Router Tests
  * POST
    * Tests success case in which the username, email, and password are included and a new account and token are successfully created.
    * Tests failure cases in which:
      * The request is missing information (username, email, and password are all required)
      * The username and/or email provided are already being used on an existing account

  * GET
    * Tests success case in which the account username and password are verified and a token can successfully be returned.
    * Tests failure cases in which:
      * No bearer authorization is provided in the HTTP authorization header.
      * No user can be found with the specified username and password.

2. Wave Router Tests
  * Tests success case in which a user successfully makes an account, the file provided is modified, and the url to the modified file is returned.
  * Tests failure cases in which:
    * The user is verified using bearer authorization but the request is bad.
    * No authorization header or a bad token is sent with the request.

3. Wave Parser Tests
  * Tests success case in which file meets all requirements and a new Constructed Wave File is created.
  * Tests failure cases in which:
    * The file is the incorrect format (not RIFF or not WAV)
    * The file size is too large
    * The file has additional pieces of data that are unexpected (subchunk id 1 or subchunk id 2 do not match the expected values of 'fmt' and 'data' respectively)
    * The file is not linear PCM encoded (i.e. the file is compressed)
    * The file has more than two channels (it is not mono or stereo)
    * The sample rate is too high (above 48k)
    * The file has a bit depth other than 8 or 16 bits

4. Transform Tests
  * Tests success cases for 8 bit and 16 bit files, i.e. that the expected results from the transform in question are properly returned.
***
## Technologies Used
### Production
* ES6
* node
* aws-sdk
* bcrypt
* dotenv
* express
* fs-extra
* http-errors
* jsonwebtoken
* mongodb
* mongoose
* multer
* winston

### Development
* aws-sdk-mock
* eslint
* faker
* jest
* superagent
***
## To Contribute
If you would like to help improve this API you can do so by opening an issue under the 'Issues' tab on the repo. We welcome any helpful feedback! Be sure to include a label to help us better understand the issue (i.e. 'bug' to report a problem).
***
## License
MIT (see License file)
***
## Authors
- Andrew Bloom | [GitHub](https://github.com/ALB37)
- Shannon Dillon | [GitHub](https://github.com/sedillon93)
- Jeff Kusowski | [GitHub](https://github.com/jjkusowski)
- David A. Lindahl | [GitHub](https://github.com/austriker27)
***
## Special Thanks
Thank you to Vinicio Vladimir Sanchez Trejo, Steve Geluso, Izzy Baer, Joshua Evans, and Ron Dunphy for help problem solving and identifying useful tools to examine WAV files.
