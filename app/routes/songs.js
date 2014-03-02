'use strict';

var Song = require('../models/song');
var Album = require('../models/album');

exports.index = function(req, res){
  Song.findAll(function(songs){
    console.log(songs);
    res.send(songs);
  });
};

exports.create = function(req, res){
  console.log(req.body);
  //var song = new Song(req.body);
  Album.findById(req.body.albumId, function(album){
   
  });
    
};
