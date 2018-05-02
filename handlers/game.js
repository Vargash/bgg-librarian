const bgg = require('../bgg');
const GameFormatter = require('../formatters/game')
const plus = "➕";

module.exports = function handleGame(channel, {action: action, command: command}, client) {
    channel.send(`Searching for '${command}'`)
    bgg('search', {query: command, type: 'boardgame'}).then(res => {
      if (res.items.total === 1) {
        res.items.item = [res.items.item];
      }
      if (res.items.total > 0 && res.items.item) {
        let items = res.items.item;
        items = items.filter((i,idx) => idx < 10)
          .map(i => i.id);
        retrieveGames(items).then(games => {
          games.forEach(g => {
            channel.send(g).then(msg => {
              msg.react(plus);
            });
          })
        });
        
      } else {
        channel.send("NoGames");
      }
    });
}

function retrieveGames(gameIds) {
  let path = gameIds.join(",");
  return bgg('thing',{id:path, stats:1, type: "boardgame"}).then(res => {
    let items = Array.isArray(res.items.item) ? res.items.item : [res.items.item];
    return items
      .sort((a,b) => b.statistics.ratings.average.value - a.statistics.ratings.average.value)
      .map(i => GameFormatter(i));
  }, err => console.error);


  // return bgg('thing',{id:path, stats:1, type: "boardgame,boardgamexpansion"}).then(res => {
  //   let items = Array.isArray(res.items.item) ? res.items.item : [res.items.item];
  //   return items
  //     .sort((a,b) => b.statistics.ratings.average.value - a.statistics.ratings.average.value)
  //     .map(i => GameFormatter(i));
  // }, err => console.error);
}
