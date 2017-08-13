# Incognita

Incognita is a modified form of Arco for the Invisible, Inc. Discord server. It is capable of:

1. ### Mathematical Inputs

Messages with a '#' prefix are handled as mathematical inputs by [mathjs](http://mathjs.org/docs/index.html).

2. ### Bulk message deletion

Messages with a '$' prefix are treated as special commands. Currently, the only '$' command is 'sweep'.

3. ### Censorship

Incognita responds to messages containing a word in the ./node_modules/profane/lib/badwords.json file (present after installation) with "🚫 ¡LANGUAGE CENSORSHIP! 🚫", which is deleted after 2 seconds to prevent spam.


## Installation
First, execute ```npm install``` in Incognita's directory. Then, create a file called secrets.json and put a valid token inside.

Your secrets.json should look like:
```
{
  "token": "YOURTOKENHERE",
  "admin": YOURIDHERE
}
```
Change YOURTOKENHERE to a token from the [Discord developer site](https://discordapp.com/developers).

Change YOURIDHERE to your user ID (or the user ID of your bot admin). Incognita will only respond to '$' commands issued by a user with a matching ID.


## Execution
To run Incognita, execute ```nodemon``` in its directory.
