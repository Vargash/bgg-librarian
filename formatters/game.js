const bgg = require('../bgg');

module.exports = function formatGame(item) {
  item.name = Array.isArray(item.name) ? item.name.find(i => i.type === 'primary') : item.name;
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
      }
    ]
  }};
}