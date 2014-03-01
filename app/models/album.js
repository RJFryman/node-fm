'use strict';

module.exports = Album;

var albums = global.nss.db.collection('albums');
var fs = require('fs');
var path = require('path');
var Mongo = require('mongodb');

function Album(album){
  this.title = album.title;
  this.artist = album.artist;
  this.genre = album.genre;
  this.year = parseInt(album.year);
  this.songs = [];
}

Album.prototype.makeDirectory = function(){
  var dirname = this.title.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/audios/' + dirname;
  fs.mkdirSync(abspath + relpath);
};

Album.prototype.addCover = function(oldname){
  var filename = this.title.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/covers/' + filename;

  var extension = path.extname(oldname);
  relpath += extension;
  fs.renameSync(oldname, abspath + relpath);
  this.cover = relpath;
};

Album.prototype.insert = function(fn){
  albums.insert(this, function(err, record){
    fn(record);
  });
};

Album.prototype.update = function(fn){
  albums.update({_id:this._id}, this, function(err, count){
    fn(count);
  });
};

Album.findAll = function(fn){
  albums.find().toArray(function(err, records){
    fn(records);
  });
};

Album.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  albums.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Album.findByTitle = function(title, fn){
  albums.findOne({title:title}, function(err, record){
    fn(record);
  });
};

Album.findByGenre = function(genre, fn){
  albums.find({genre:genre}).toArray(function(err, records){
    fn(records);
  });
};

Album.findByArtist = function(artist, fn){
  albums.find({artist:artist}).toArray(function(err, records){
    fn(records);
  });
};

Album.deleteById = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  albums.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Album.prototype.addSong = function(oldpath, filename){
  var dirname = this.title.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/audios/' + dirname + '/' + filename;

  fs.renameSync(oldpath, abspath + relpath);
  this.songs.push(relpath);
};
