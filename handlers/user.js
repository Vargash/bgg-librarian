const bgg = require('../bgg');
const ThingSimpleFormatter = require('../formatters/thing.simple');

module.exports = async function handleUsers(channel, {command: command}) {
    const name = await findUser(command);
    channel.send(`Finding ${name}'s collection`)
    const res = await findCollection(command);
    if (!res.items) {
      channel.send("Your request has been queued.  Please try again later")
      return;
    }
    if (res.items.totalitems > 0 && res.items.item) {
      let msg = {
          embed: {
            fields:[]
          }
      };
      let items = res.items.item;
      channel.send(`${res.items.item.length} games found`);
      items = items
        .map((i, idx) => {
          if (idx !== 0 && idx % 10 === 0) {
            channel.send(msg);
            msg = {embed:{fields:[]}};
          }
          msg.embed.fields.push(ThingSimpleFormatter(i));
        })
      channel.send(msg);
    } else {
      channel.send("NoGames");
    }
}
                                     
async function findUser(name) {
  return bgg('user', {name:name}).then(res => {
    return `${res.user.firstname.value} ${res.user.lastname.value}`;
  })
}

async function findCollection(username) {
  return bgg('collection', {username: username, stats:1,own:1});
}


function log(item) {
  console.log(item)
}