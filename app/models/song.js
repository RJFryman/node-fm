'use strict';

module.exports = Song;
var _ = require('lodash');
//var Mongo = require('mongodb');

function Song(song){
  this.title = song.title;
  this.tags = song.tags.split(',').map(function(tag){return tag.trim();});
  this.tags = _.compact(this.tags);
  this.albumId = song.albumId || '';
}

Song.prototype.insert = function(fn){
  songs.insert(this, function(err, records){
    fn(records);
  });
};
