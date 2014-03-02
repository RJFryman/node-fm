'use strict';

process.env.DBNAME = 'nodesongtest';
var app = require('../../app/app');
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var Song;
var Album;

describe('songs', function(){

  before(function(done){
    request(app)
    .get('/songs')
    .end(function(err, res){
      Song = require('../../app/models/song');
      Album = require('../../app/models/album');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/covers/test* ' + __dirname + '/../../app/static/audios/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/euro.jpg';
      var copy1file = __dirname + '/../fixtures/euro1.jpg';
      var copy2file = __dirname + '/../fixtures/euro2.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(){
        done();
      });
    });
  });

////////////POSTS////////////////////////

  describe('POST /songs', function(){
    it('should create a new song', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'MJ', genre:'pop', year:'1978'});
      a1.makeDirectory();
      a1.insert(function(){
        request(app)
        .post('/songs')
        .field('title', 'Test BadAss Song')
        .field('tags', 'bad, ass, kick')
        .field('albumId', a1._id.toString())
        .expect(302, done);
      });
    });
  });
});
