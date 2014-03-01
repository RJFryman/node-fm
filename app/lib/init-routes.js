'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var album = require('../routes/album');
  var artist = require('../routes/artist');

  app.get('/', d, home.index);
  app.get('/album', d, album.index);
  app.get('/artist', d, artist.index);
  console.log('Routes Loaded');
  fn();
}

