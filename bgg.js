const options = {
  timeout : 10000,
  retry: {
    initial: 100,
    multiplier: 2,
     max: 15e3
  }
};

module.exports = require('bgg')(options);