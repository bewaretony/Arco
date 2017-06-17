# Arco

Arco is general-purpose bot I use to personally moderate my servers. It currently can handle a variety of mathematical inputs using [mathjs](http://mathjs.org/), as well as responding to the ```$sweep``` command to bulk-delete messages from a specific user.

To input a mathematical prompt, simply prefix your prompt with an octothorpe (#). See the [mathjs documentation](http://mathjs.org/docs/index.html) for more info.

## Installation
First, execute ```npm install``` in Arco's directory. Then, create a file called secrets.json and put a valid token inside.

Your secrets.json should look like:
```
{
  "token": "YOURTOKENHERE"
}
```
Change YOURTOKENHERE to a token from the [Discord developer site](https://discordapp.com/developers).

## Execution
To run Arco, execute ```nodemon``` in its directory.
