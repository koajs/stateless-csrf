/**
 * Module Dependencies
 */

var roo = module.exports = require('roo')();
var csrf = require('../');

roo.use(csrf({
  secret: 'some secret',
  cookie: 'token'
}));

// ignore emitted events
roo.app.on('error', function(){})

roo.get('/', function * () {
  this.body = this.state.csrf;
})

roo.post('/', function * () {
  this.body = 'you are in!';
})
