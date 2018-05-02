module.exports = function handleHelp(channel) {
  channel.send(`This bot will query against BoardGameGeek.
The following commands are supported:
  - §game <game title> : Retrieves details about games
  - §user <user name></user>: Retrieves that BGG users collection of games
  - §help/info : Displays this message
`)
}