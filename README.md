# Arco

Arco is a specialized bot that can perform the following:

1. ### Mathematical Inputs

Messages with a '#' prefix are handled as mathematical inputs by [mathjs](http://mathjs.org/docs/index.html).

2. ### Bulk message deletion

Messages with a '$' prefix are treated as special commands. Currently, the only '$' command is 'sweep'.

3. ### Censorship

Arco responds to messages containing a word in the ./node_modules/profane/lib/badwords.json file (present after installation) with "🚫 ¡LANGUAGE CENSORSHIP! 🚫", which is deleted after 2 seconds to prevent spam.


## Installation
First, execute ```npm install``` in Arco's directory. Then, create a file called secrets.json and put a valid token inside.

Your secrets.json should look like:
```
{
  "token": "YOURTOKENHERE",
  "admin": YOURIDHERE
}
```
Change YOURTOKENHERE to a token from the [Discord developer site](https://discordapp.com/developers).

Change YOURIDHERE to your user ID (or the user ID of your bot admin). Arco will only respond to '$' commands issued by a user with a matching ID.


## Execution
To run Arco, execute ```nodemon``` in its directory.
