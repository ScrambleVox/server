'use strict';

module.exports = () => {
  console.log(`
Welcome to the scramblevox CLI!

Getting started:

The command structure for the scramblevox CLI takes the form of:
$ 'scramblevox <command> <...parameters>'

To pull up this reference guide, type:
$ 'scramblevox help'
at any time.

The transforms work by making a post to the server running the scramblevox app.

Basic authentication is performed when signing up or logging in, and a authorization token is returned. In order to make a post/get/delete, you must be signed in.

To sign up, type:
$ 'scramblevox signup <new username> <new password> <new email-address>'

To log in, type:
$ 'scramblevox login <username> <password>'

The token returned is written to a file in your home directory. We recommend logging out when you are done in order to clear this file.

To log out, type:
$ 'scramblevox logout'

To perform a transform, type:
$ 'scramblevox <transform> <filepath>'

Note that the filepath is relative to the directory where this project was installed.
The available transforms are currently 'bitcrusher', 'delay', 'noise', 'reverse' and 'downpitcher'.
The file will be transformed and a link will be returned to the transformed file, which is hosted on AWS.

To learn more about each function, check out the readme for this project on Github at:
https://github.com/ScrambleVox/server

Only one file persists for a given user at any one time. If another transform is performed, the existing file will be overwritten.

To get the current file associated with your account, type:
$ 'scramblevox get'

To delete the current file assosiated with your account, type:
$ 'scramblevox get'
  `);
};
