'use strict';

var Song = require('../models/song');
var Album = require('../models/album');
var _ = require('lodash');

exports.index = function(req, res){
  Song.findAll(function(songs){
    res.send({songs:songs});
  });
};

exports.create = function(req, res){
  var s1 = new Song(req.body);
  Album.findById(req.body.albumId, function(album){
    album = _.extend(album, Album.prototype);
    s1.addFile(req.files.song.path, req.files.song.name, function(){
      s1.save(function(){
        album.addSong(s1._id);
        album.update(function(){
          res.redirect('/albums/'+req.body.albumId);
        });
      });
    });
  });
};

exports.destroy = function(req, res){
  var songId = req.params.id;
  Song.findById(songId, function(song){
    var albumId = song.albumId;
    Album.findById(albumId, function(album){
      album = _.extend(album, Album.prototype);
      album.removeSong(songId);
      album.update(function(){
        Song.deleteById(songId, function(){
          res.redirect('/albums/'+albumId);
        });
      });
    });
  });
};
