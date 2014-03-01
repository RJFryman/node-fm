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
<<<<<<< HEAD
  app.get('/album', d, album.index);
  app.get('/artist', d, artist.index);
=======
  app.get('/albums', d, albums.index);
  app.get('/albums/:id', d, albums.show);
  app.get('/artists/:name', d, artists.show);
  app.post('/albums', d, albums.create);
  app.post('/albums/:id', d, albums.addSong);
  app.put('/albums/:id', d, albums.update);
  app.del('/albums/:id', d, albums.destroy);
>>>>>>> d6f056df596d5c221a9a1fe795c5118275ba7cc9
  console.log('Routes Loaded');
  fn();
}

