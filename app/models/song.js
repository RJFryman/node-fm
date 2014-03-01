'use strict';

module.exports = Song;
var _ = require('lodash');
var Mongo = require('mongodb');
var songs = global.nss.db.collection('songs');

function Song(song){
  this.title = song.title;
  this.tags = song.tags.split(',').map(function(tag){return tag.trim();});
  this.tags = _.compact(this.tags);
  this.albumId = song.albumId || '';
}

Song.prototype.insert = function(fn){
  songs.save(this, function(err, record){
    fn(record);
  });
};

Song.prototype.update = function(fn){
  songs.update({_id:this._id}, this, function(err, count){
    fn(count);
  });
};

Song.deleteById = function (id, fn){
  var _id = new Mongo.ObjectID(id);
  songs.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Song.findAll = function(fn){
  songs.find().toArray(function(err, records){
    fn(records);
  });
};

Song.findById = function(id, fn){
  var _id= Mongo.ObjectID(id);
  songs.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Song.findByTitle = function(title, fn){
  songs.find({title:title}).toArray(function(err,records){
    fn(records);
  });
};

Song.findByTag = function(tag, fn){
  songs.find({tags:tag}).toArray(function(err, records){
    fn(records);
  });
};

Song.findByAlbumId = function(id, fn){
  var _id= Mongo.ObjectID(id);
  songs.find({albumId:_id}).toArray(function(err, records){
    fn(records);
  });
};
