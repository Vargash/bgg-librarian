const bgg = require('../bgg');

module.exports = function formatThing(item) {
  item.name = Array.isArray(item.name) ? item.name.find(i => i.type === 'primary') : item.name;
  return {embed: {
    color:344703,
    url:`https://boardgamegeek.com/boardgame/${item.id}`,
    title:item.name.$t,
    fields:[
      {
        name:"BGG Average",
        value:""+item.stats.rating.average.value
      }
    ]
  }};
}