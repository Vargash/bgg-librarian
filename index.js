const bgg = require('./bgg');
require('dotenv').config();
const plus = "➕";
const decode = require('unescape');

const 
    info = require('./handlers/info'),
    game = require('./handlers/game'),
    user = require('./handlers/user');

const botMention = `<@${process.env.BOTID}>`;
const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const prefix = '§';

client.on('ready', () => {
  console.log('I am ready');
})

client.on('message', message => {
  let callingUser = message.author;
  let callingChannel = message.channel;
  if (message.author.bot) return;

  const gameSearch = /\[\[(.*?)\]\]/;
  let res = gameSearch.exec(message.content);
  if (!res) return;
  game(callingChannel, {command: res[1]}, client);


  // console.log(message.content.startsWith(prefix));
  // if (!message.content.startsWith(prefix)) return;
  // let commands = parseCommands(message.content);
  // switch(commands.action) {
  //   case 'help':
  //   case 'info':
  //     info(callingChannel);
  //     break;
  //   case 'game' :
  //     game(callingChannel, commands);
  //     break;
  //   case 'user' :
  //     user(callingChannel, commands);
  //     break;
  // }
});

client.on('messageReactionAdd', (messageReaction, user) => {
  if (user.bot) return;
  if (messageReaction._emoji.name == plus) {
    const oldEmbed = messageReaction.message.embeds[0];
    const itemID = oldEmbed.url.split('/').pop();
    messageReaction.message.edit({
      embed: { description: "Recupero informazioni in corso ..." }
    }).then(() => {
      return retrieveGame(itemID);
    }).then(res => {
      return messageReaction.message.edit(res[0]);
    }).then(msg => {
      msg.clearReactions();
    });
  }
});

client.login(process.env.SECRET).then(() => {
  client.user.setActivity('I play American. Strongly.');
});

function parseCommands(content) {
  content = content.substring(prefix.length).trim();
  let action = getAction(content);
  return {action: action, command: getCommand(action, content)};
}

function getAction(content) {
  return content.split(" ")[0].toLowerCase();
}

function getCommand(action,content) {
  return content.substring(action.length, content.length).trim();
}

function retrieveGame(gameId) {
  console.log("retrieve game id " + gameId);
  return bgg('thing',{id:gameId, stats:1, type: "boardgame"}).then(res => {
    console.log(res);
    let items = Array.isArray(res.items.item) ? res.items.item : [res.items.item];
    return items
      .sort((a,b) => b.statistics.ratings.average.value - a.statistics.ratings.average.value)
      .map(i => formatFullGame(i));
  }, err => console.error);
}

function formatFullGame(item) {
  item.name = Array.isArray(item.name) ? item.name.find(i => i.type === 'primary') : item.name;
  let decoded = asciiToText(item.description);
  decoded = asciiToText(decoded);
  decoded = decode(decoded, "all");
  let description = (decoded.length > 1024) ? decoded.substr(0, 1018) + '[...]' : decoded;
  return {embed: {
    color:344703,
    url:`https://boardgamegeek.com/boardgame/${item.id}`,
    title:item.name.value,
    thumbnail:{
      url: `${item.thumbnail}`
    },
    fields:[
      {
        name:"BGG Average",
        value:""+item.statistics.ratings.average.value
      }, {
        name:"Weight",
        value: ""+item.statistics.ratings.averageweight.value
      }, {
        name:"Description",
        value: `${description}`
      }
    ]
  }};
}

function asciiToText(string) {
  return string.replace(/&amp;#(\d+);/g, function (m, n) { return String.fromCharCode(n); });
}
