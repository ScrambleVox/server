Excellent work. The repo README looks very nice. Great job adding the
visualizations showing what's happening with each transformation.
Thanks for adding the "Special Thanks" section at the end of the repo!

#### Overall Code Style
Overall, very good! Good indentation. Good modularization. Good variable names.
I have a few specific suggestions. See `// REVIEW:` comments in pull request diff.

#### File Structure
Good file structure. It's easy to navigate the project.
`lib/transforms/bitcrusher.js` and all the other transforms in their own file
there is a great way to organize things.

`wave-parser.js` is very cleanly written. Excellent. Each of the transforms are
very cleanly written too. It looks like it would be very easy to add more
transforms to this project.

#### Models
Nice clean looking models.

#### Tests
Excellent tests. The `wave-parser.test.js` is especially nice.

#### The CLI Tool
It's very cool that you've set this up so you can `npm i -g` and then run your
app on the command line.

The `help` CLI is very verbose! I suggest condensing it to something 
like the following. Notice that you don't really need to explain every command,
programmers will generally be able to figure out what you're talking about,
especially because you all chose good command names.

```
 Welcome to scramblevox CLI! Here are the basic commands.

    scramblevox help
    scramblevox signup <new username> <new password> <new email-address>
    scramblevox login <username> <password>
    scramblevox logout
    scramblevox <transform> <filepath>

The available transforms are currently 'bitcrusher', 'delay', 'noise',
'reverse' and 'downpitcher'. Running a transform requires you to be logged in.

To get or delete the current file associated with your account, type:

    scramblevox get
    scramblevox delete

Read more at: https://github.com/ScrambleVox/server
```

#### cli.js

```js

```
