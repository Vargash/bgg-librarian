const bgg = require('../bgg');
const utils = require('../utils');
const decode = require('unescape');

exports.simple = function(item) {
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

exports.full = function(item) {
  item.name = Array.isArray(item.name) ? item.name.find(i => i.type === 'primary') : item.name;
  let decoded = utils.asciiToText(item.description);
  decoded = utils.asciiToText(decoded);
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