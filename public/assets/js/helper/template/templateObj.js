const moment = require('moment');

module.exports = function () {
  var obj = {
    user: null,
    groups: null,
    year: moment().format('YYYY'),
    page: '',
    errors: null
  };
  return obj;
};