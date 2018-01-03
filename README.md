## Purpose
This API is designed based on RESTful principles. Currently it is focused on back-end functionality, with a CLI intended as a future improvement. It enables users to transform an 8 bit or 16 bit WAV audio file using one of the provided functions (see 'Transforms').

<!-- we can add in encryption if we reach that point -->

## Set Up
To set up ScrambleVox on your own machine, follow the steps below.
1.


## Tests
ScrambleVox implements continuous integration (CI) via Travis CI and continuous deployment via Heroku. Only modules which pass all tests and build properly will be automatically deployed on Heroku.

Tests examine both proper behavior for each route as well as behavior when errors occur. The following tests can be executed by running 'npm test' after following the steps under 'Set Up'. Note: failure to set up the API properly before running tests will prevent tests from running.

## Transforms
1. Bitcrusher: Reduces the resolution of the audio from 8 or 16 bits to 2 bits without reducing bit depth.

2. Time Stretch: Reduces the sample rate of the audio file by half, reducing the maximum possible frequency of the recording.

## Routes
## Account setup
1. POST /signup
2. GET /login
## Transforming files
1. POST /waves/bitcrusher
<!-- 2. POST /waves/transform2 -->

## Internal Infrastructure
1. models (user and wave)
2. middleware (express, fs-extra?, error, logger, basic auth, bearer auth)

## Code Examples

## Technologies Used
### For production
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

### For development
* aws-sdk-mock
* eslint
* faker
* jest
* superagent

<!-- * libraries we used, if any -->

## Contribute
If you would like to help improve this API you can do so by opening an issue under the 'Issues' tab on the repo. Please tell us what your feedback is related to by including a label (i.e. 'bug' to report a problem).

## License
MIT (see License file)

## Credits
Thank you to Vinicio Vladimir Sanchez Trejo, Steve Geluso, Izzy Baer, Joshua Evans, and Ron Dunphy for help problem solving and identifying useful tools to examine WAV files.
