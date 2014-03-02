'use strict';

process.env.DBNAME = 'nodesongtest';
var app = require('../../app/app');
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var expect = require('chai').expect;
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

////////////POST////////////////////////

  describe('POST /songs', function(){
    it('should create a new song', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'MJ', genre:'pop', year:'1978'});
      a1.makeDirectory();
      a1.insert(function(){
        request(app)
        .post('/songs')
        .attach('song', __dirname + '/../fixtures/euro2.jpg')
        .field('title', 'Test BadAss Song')
        .field('tags', 'bad, ass, kick')
        .field('albumId', a1._id.toString())
        .expect(302, done);
      });
    });
  });


///////////////DELETE////////////////////

  describe('DELETE /songs/:id', function(){
    it('should delete a song from the db and remove it from the albums song list, then redirect to the album page', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'MJ', genre:'pop', year:'1978'});
      a1.makeDirectory();
      a1.insert(function(){
        var s1 = new Song({title: 'Test Song', tags:'b', albumId:a1._id.toString()});
        s1.save(function(){
          a1.addSong(s1._id.toString());
          request(app)
          .del('/songs/'+s1._id.toString())
          .expect(302, done);
        });
      });
    });
  });

  describe('GET /songs', function(){
    it('should get all songs', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'MJ', genre:'pop', year:'1978'});
      a1.makeDirectory();
      a1.insert(function(){
        var s1 = new Song({title: 'Test Song', tags:'a, b', albumId:a1._id.toString()});
        var s2 = new Song({title: 'Test Song 2', tags:'b, c', albumId:a1._id.toString()});
        var s3 = new Song({title: 'Test Song 3', tags:'c, d', albumId:a1._id.toString()});
        s1.save(function(){
          a1.addSong(s1._id.toString());
          s2.save(function(){
            a1.addSong(s2._id.toString());
            s3.save(function(){
              a1.addSong(s3._id.toString());
              request(app)
              .get('/songs')
              .end(function(err, res){
                expect(res.body.songs).to.have.length(3);
                done();
              });
            });
          });
        });
      });
    });
  });
});
