'use strict';

var Album = require('../models/album');

exports.index = function(req, res){
  res.render('albums/index', {title: 'Express Template'});
};

exports.show = function(req, res){
  Album.findById(req.params.id, function(album){
    res.render('albums/show', {album:album, title:album.title});
  });
};

exports.create = function(req, res){
  var album = new Album(req.body);
  album.addCover(req.files.cover.path);
  album.makeDirectory();
  album.insert(function(){
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
    album.addSong(req.files.song.path, req.files.song.name);
    album.update(function(){
      res.redirect('albums/'+ req.params.id);
    });
  });
};
