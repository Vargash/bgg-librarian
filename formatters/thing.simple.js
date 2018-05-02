const bgg = require('../bgg');

module.exports = function formatThingSimple(item) {
  return {
    name: item.name.$t,
    value:`[${item.name.$t}](${bggLink(item.objectid)}) (BGG Rating:${item.stats.rating.average.value})`
  }
}

function bggLink(id) {
  return `https://boardgamegeek.com/boardgame/${id}`;
}