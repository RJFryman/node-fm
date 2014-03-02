'use strict';

var Song = require('../models/song');
var Album = require('../models/album');
var album;

exports.index = function(req, res){
  Album.findAll(function(albums){
    res.render('albums/index', {title: 'Showing All Albums', albums:albums});
  });
};

exports.show = function(req, res){
  Song.findAll(function(songs){
    Album.findById(req.params.id, function(album){
      res.render('albums/show', {songs:songs, album:album, title:album.title});
    });
  });
};

exports.create = function(req, res){
  console.log(req.body);
  album = new Album(req.body);
  album.addCover(req.files.cover.path);
  album.makeDirectory();
  album.insert(function(album){
    res.redirect('/');
  });
};

exports.update = function(req, res){
  Album.findById(req.params.id, function(album){
    album.update(function(){
      res.redirect('/albums/'+req.params.id);
    });
  });
};

exports.destroy = function(req, res){
  Album.deleteById(req.params.id, function(){
    res.redirect('/albums');
  });
};

exports.addSong = function(req, res){
  Album.findById(req.params.id, function(album){
    album = new Album(album);
    album.addSong(req.files.song.path, req.files.song.name);
    album.update(function(){
      res.redirect('albums/'+ req.params.id);
    });
  });
};
